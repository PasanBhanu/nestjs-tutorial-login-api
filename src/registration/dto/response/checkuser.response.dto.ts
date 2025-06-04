import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../../shared/dto/common-response.dto';

export class CheckuserResponse extends CommonResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  mobileNumber: string;
  @ApiProperty()
  profileUrl: string;
  @ApiProperty()
  registrationComplete: boolean;
}
