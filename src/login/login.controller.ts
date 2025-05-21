import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRequest } from './dto/request/login.request.dto';
import { LoginResponse } from './dto/response/login.response.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('login')
export class LoginController {
  @Post('app-user')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponse, description: 'success' })
  appUserLogin(@Body() request: LoginRequest): LoginResponse {
    const response = new LoginResponse();
    response.userId = request.deviceId;
    response.registrationComplete = true;

    return response;
  }
}
