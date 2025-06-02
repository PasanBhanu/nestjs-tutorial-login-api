import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDetailsResponse } from './dto/response/user.response.dto';

@Controller('user')
export class UserController {
  @Get('get')
  @ApiOkResponse({ type: UserDetailsResponse, description: 'success' })
  appUserInformation(): UserDetailsResponse {
    const response = new UserDetailsResponse();
    return response;
  }
}
