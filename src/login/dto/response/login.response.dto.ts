import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../../common/dto/common-response.dto';

export class LoginResponse extends CommonResponse {
  @ApiProperty()
  userId: string | null;
  @ApiProperty()
  registrationComplete: boolean;
}
