import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LoginRequest } from './dto/request/login.request.dto';
import { LoginResponse } from './dto/response/login.response.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { PhoneAuthenticationRequest } from './dto/request/phone-authentication.request.dto';
import { PhoneAuthenticationResponse } from './dto/response/phone-authentication.response.dto';
import { ValidateOtpRequest } from './dto/request/validate-otp.request.dto';
import { ValidateOtpResponse } from './dto/response/validate-otp.response.dto';
import { LoginService } from './login.service';
import { OtpTokenGuard } from '../common/guards/otptoken.guard';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('app-user')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginResponse,
    description: 'success',
  })
  appUserLogin(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.loginService.appUserLogin(request);
  }

  @Post('phone-authentication')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: PhoneAuthenticationResponse,
    description: 'success',
  })
  phoneAuthentication(@Body() request: PhoneAuthenticationRequest): Promise<PhoneAuthenticationResponse> {
    return this.loginService.phoneAuthentication(request);
  }

  @UseGuards(OtpTokenGuard)
  @Post('phone-authentication-resend')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: PhoneAuthenticationResponse,
    description: 'success',
  })
  phoneAuthenticationResend(@Request() req): Promise<PhoneAuthenticationResponse> {
    return this.loginService.phoneAuthenticationResend(req);
  }

  @UseGuards(OtpTokenGuard)
  @Post('validate-phone-authentication')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ValidateOtpResponse,
    description: 'success',
  })
  validatePhoneAuthenticationOtp(@Body() request: ValidateOtpRequest, @Request() req): Promise<ValidateOtpResponse> {
    return this.loginService.validatePhoneAuthenticationOtp(request, req);
  }
}
