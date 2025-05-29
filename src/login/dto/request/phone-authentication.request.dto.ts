import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PhoneAuthenticationRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly phoneNumber: string;
}
