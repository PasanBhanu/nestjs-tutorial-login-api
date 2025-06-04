import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { RegistrationRequest } from './dto/request/registration.request.dto';
import { RegistrationResponse } from './dto/response/registration.response.dto';
import { RegistrationService } from './registration.service';
import { CheckuserResponse } from './dto/response/checkuser.response.dto';
import { CheckuserRequest } from './dto/request/checkuser.request.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('app-user')
  @ApiCreatedResponse({
    type: RegistrationResponse,
    description: 'success',
  })
  async createAppUser(@Body() request: RegistrationRequest): Promise<RegistrationResponse> {
    return this.registrationService.createAppUser(request);
  }

  @Post('check-user')
  @ApiCreatedResponse({
    type: CheckuserResponse,
    description: 'success',
  })
  @HttpCode(HttpStatus.OK)
  async checkUser(@Body() request: CheckuserRequest): Promise<CheckuserResponse> {
    return this.registrationService.checkUser(request);
  }
}
