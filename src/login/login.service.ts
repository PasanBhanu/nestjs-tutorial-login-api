import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../database/schemas/UserSchema';
import { Model } from 'mongoose';
import { LoginRequest } from './dto/request/login.request.dto';
import { LoginResponse } from './dto/response/login.response.dto';
import { PhoneAuthenticationResponse } from './dto/response/phone-authentication.response.dto';
import { PhoneAuthenticationRequest } from './dto/request/phone-authentication.request.dto';
import { ValidateOtpRequest } from './dto/request/validate-otp.request.dto';
import { ValidateOtpResponse } from './dto/response/validate-otp.response.dto';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcrypt';
import { OtpSession } from '../database/schemas/OtpSession';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(OtpSession.name) private otpSessionModel: Model<OtpSession>,
    private jwtService: JwtService,
  ) {}

  async appUserLogin(request: LoginRequest): Promise<LoginResponse> {
    const optUserByFirebaseId = await this.userModel.exists({ 'firebaseLinks.id': request.firebaseId }).exec();

    if (optUserByFirebaseId !== null) {
      // Add Device & Update FCM Token
      const deviceExists = await this.userModel
        .exists({
          _id: optUserByFirebaseId,
          'devices.deviceId': request.deviceId,
        })
        .exec();

      if (deviceExists === null) {
        // New Device: Add Device
        await this.userModel
          .updateOne(
            { _id: optUserByFirebaseId },
            {
              $addToSet: {
                devices: {
                  deviceId: request.deviceId,
                  deviceName: request.deviceName,
                  fcmToken: request.fcmToken,
                },
              },
            },
          )
          .exec();
      } else {
        // Existing Device - Update FCM Token
        await this.userModel
          .updateOne(
            {
              _id: optUserByFirebaseId,
              'devices.deviceId': request.deviceId,
            },
            {
              $set: {
                'devices.$.fcmToken': request.fcmToken,
              },
            },
          )
          .exec();
      }

      const response = new LoginResponse();
      response.userId = optUserByFirebaseId._id.toString();
      response.registrationComplete = true;

      return response;
    } else {
      const response = new LoginResponse();
      response.userId = null;
      response.registrationComplete = false;
      return response;
    }
  }

  async phoneAuthentication(request: PhoneAuthenticationRequest): Promise<PhoneAuthenticationResponse> {
    // Generate OTP
    const otpValue: number = randomInt(100000, 1000000);
    const otpHash = await bcrypt.hash(otpValue.toString(), 10);

    this.logger.log(`OTP: ${otpValue}`);

    // Save to DB
    const otpSession = await this.otpSessionModel.create({
      otp: otpHash,
      phoneNumber: request.phoneNumber,
      attempts: 0,
      sendAttempts: 1,
      status: 1,
    });

    // Generate Token
    const payload = {
      iss: 'azbow-auth-server',
      sub: 'otp',
      aud: request.phoneNumber,
      otp_id: otpSession._id.toString(),
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 300,
    });

    await this.otpSessionModel.findByIdAndUpdate(otpSession, {
      token: token,
    });

    // Send to SMS Gateway

    // Response
    const response = new PhoneAuthenticationResponse();
    response.attempt = 1;
    response.otpToken = token;
    return response;
  }

  async phoneAuthenticationResend(req): Promise<PhoneAuthenticationResponse> {
    // Get OTP ID from Token
    const otpId: string = req.tokenContext.otp_id;

    const otpSession = await this.otpSessionModel.findById(otpId);
    if (!otpSession) {
      throw new UnauthorizedException();
    }

    // Calculate Attempts
    let attempts = otpSession.sendAttempts;
    if (attempts >= 3) {
      await this.otpSessionModel.findByIdAndUpdate(otpSession._id, {
        status: 99,
      });
      throw new UnauthorizedException();
    }
    attempts = attempts + 1;

    // Generate OTP
    const otpValue: number = randomInt(100000, 1000000);
    const otpHash = await bcrypt.hash(otpValue.toString(), 10);

    this.logger.log(`OTP: ${otpValue}`);

    // Generate Token
    const payload = {
      iss: 'azbow-auth-server',
      sub: 'otp',
      aud: otpSession.phoneNumber,
      otp_id: otpSession._id.toString(),
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 300,
    });

    // Update DB
    await this.otpSessionModel.findByIdAndUpdate(otpSession._id, {
      token: token,
      otp: otpHash,
      sendAttempts: attempts,
    });

    // Send to SMS Gateway

    // Response
    const response = new PhoneAuthenticationResponse();
    response.attempt = attempts;
    response.otpToken = token;
    return response;
  }

  async validatePhoneAuthenticationOtp(request: ValidateOtpRequest, req): Promise<ValidateOtpResponse> {
    // Get OTP ID from Token
    const otpId: string = req.tokenContext.otp_id;

    const otpSession = await this.otpSessionModel.findOne({
      _id: otpId,
      status: 1,
    });
    if (!otpSession) {
      throw new UnauthorizedException();
    }

    // Calculate Attempts
    let attempts = otpSession.attempts;
    if (attempts >= 3) {
      await this.otpSessionModel.findByIdAndUpdate(otpSession._id, {
        status: 99,
      });

      throw new UnauthorizedException();
    }
    attempts = attempts + 1;
    await this.otpSessionModel.findByIdAndUpdate(otpSession._id, {
      attempts: attempts,
      status: 1,
    });

    const otpMatch = await bcrypt.compare(request.otpValue, otpSession.otp);

    if (!otpMatch) {
      throw new UnauthorizedException();
    }

    await this.otpSessionModel.findByIdAndUpdate(otpSession._id, {
      status: 90,
    });

    const hash = await bcrypt.hash(otpSession.phoneNumber, 10);

    // Response
    const response = new ValidateOtpResponse();
    response.hash = hash;
    return response;
  }
}
