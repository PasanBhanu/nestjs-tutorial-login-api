import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateOtpRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly otpValue: string;
}
