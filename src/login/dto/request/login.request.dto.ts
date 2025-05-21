import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly firebaseId: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly fcmToken: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly deviceId: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly deviceName: string;
}
