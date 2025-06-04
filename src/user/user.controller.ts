import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDetailsResponse } from './dto/response/user.response.dto';
import { FirebaseTokenGuard } from '../common/guards/firebasetoken.guard';

@Controller('user')
export class UserController {
  @UseGuards(FirebaseTokenGuard)
  @Get('get')
  @ApiOkResponse({
    type: UserDetailsResponse,
    description: 'success',
  })
  appUserInformation(): UserDetailsResponse {
    const response = new UserDetailsResponse();
    return response;
  }
}
