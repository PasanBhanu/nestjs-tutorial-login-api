import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { RegistrationRequest } from './dto/request/registration.request.dto';
import { RegistrationResponse } from './dto/response/registration.response.dto';
import { RegistrationService } from './registration.service';

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
}
