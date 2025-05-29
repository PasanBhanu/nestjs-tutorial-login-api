import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateOtpRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly otpId: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly otpValue: string;
}
