import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDetailsResponse } from './dto/response/user.response.dto';
import { FirebaseTokenGuard } from '../common/guards/firebasetoken.guard';
import UserService from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(FirebaseTokenGuard)
  @Get('get')
  @ApiOkResponse({
    type: UserDetailsResponse,
    description: 'success',
  })
  appUserInformation(@Request() req): Promise<UserDetailsResponse> {
    return this.userService.appUserInformation(req);
  }
}
