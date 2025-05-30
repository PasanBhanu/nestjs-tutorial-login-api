import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../../shared/dto/common-response.dto';

export class PhoneAuthenticationResponse extends CommonResponse {
  @ApiProperty()
  attempt: number;

  @ApiProperty()
  otpToken: string;
}
