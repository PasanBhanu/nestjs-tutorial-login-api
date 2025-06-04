import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../database/schemas/UserSchema';
import { Model } from 'mongoose';
import { RegistrationRequest } from './dto/request/registration.request.dto';
import { RegistrationResponse } from './dto/response/registration.response.dto';
import * as bcrypt from 'bcrypt';
import { PhoneAuthentication } from '../database/schemas/PhoneAuthenticationSchema';
import { CheckuserRequest } from './dto/request/checkuser.request.dto';
import { CheckuserResponse } from './dto/response/checkuser.response.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PhoneAuthentication.name) private phoneAuthenticationModel: Model<PhoneAuthentication>,
  ) {}

  async createAppUser(request: RegistrationRequest): Promise<RegistrationResponse> {
    // Check Firebase ID Exists
    const optUserByFirebaseId = await this.userModel.exists({ 'firebaseLinks.id': request.firebaseId }).exec();

    if (optUserByFirebaseId === null) {
      // Check Email Exists
      const optUserByEmail = await this.userModel.exists({ email: request.email }).exec();

      if (optUserByEmail === null) {
        // Register New User
        let hasPassword = false;
        if (request.provider === 'email') {
          hasPassword = true;
        }

        const hash = await bcrypt.hash(request.mobileNumber, 10);

        const user = await this.userModel.create({
          name: request.name,
          email: request.email,
          mobileNumber: request.mobileNumber,
          profileUrl: request.profileUrl,
          devices: [
            {
              deviceId: request.deviceId,
              deviceName: request.deviceName,
              fcmToken: request.fcmToken,
            },
          ],
          firebaseLinks: [
            {
              id: request.firebaseId,
              provider: request.provider,
            },
          ],
          hasPassword: hasPassword,
          status: 1,
        });

        await this.phoneAuthenticationModel.create({
          userId: user._id,
          phoneNumber: request.mobileNumber,
          hash: hash,
        });

        const response = new RegistrationResponse();
        response.userId = user._id.toString();
        return response;
      } else {
        const deviceExists = await this.userModel
          .exists({
            _id: optUserByEmail,
            'devices.deviceId': request.deviceId,
          })
          .exec();

        if (deviceExists === null) {
          // New Device: Add Device
          await this.userModel
            .updateOne(
              { _id: optUserByEmail },
              {
                $addToSet: {
                  firebaseLinks: {
                    id: request.firebaseId,
                    provider: request.provider,
                  },
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
          // Existing Device - Add Firebase Link & Update FCM Token
          await this.userModel
            .updateOne(
              { _id: optUserByEmail },
              {
                $addToSet: {
                  firebaseLinks: {
                    id: request.firebaseId,
                    provider: request.provider,
                  },
                },
              },
            )
            .exec();

          // Update FCM Token
          await this.userModel
            .updateOne(
              {
                _id: optUserByEmail,
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

        // Update Phone Authentication with User ID
        if (request.provider === 'phone') {
          await this.phoneAuthenticationModel.updateOne({ phoneNumber: request.mobileNumber }, { $set: { userId: optUserByEmail } });
        }

        const response = new RegistrationResponse();
        response.userId = optUserByEmail._id.toString();
        return response;
      }
    } else {
      // Break Registration - Data Issue
      throw new Error('User registration step mismatch.');
    }
  }

  async checkUser(request: CheckuserRequest): Promise<CheckuserResponse> {
    const response = new CheckuserResponse();

    if (request.provider === 'phone') {
      const optUserByMobile = await this.userModel.exists({ mobileNumber: request.value }).exec();

      response.registrationComplete = optUserByMobile !== null;
    } else {
      const optUserByEmail = await this.userModel.exists({ email: request.value }).exec();

      response.registrationComplete = optUserByEmail !== null;
    }

    return response;
  }
}
