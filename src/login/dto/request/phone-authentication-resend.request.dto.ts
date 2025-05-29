import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneAuthenticationResendRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly otpId: string;
}
