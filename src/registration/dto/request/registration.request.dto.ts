import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationRequest {
  @IsNotEmpty()
  @ApiProperty()
  firebaseId: string;
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @ApiProperty()
  mobileNumber: string;
  @IsNotEmpty()
  @ApiProperty()
  profileUrl: string;
  @IsNotEmpty()
  @ApiProperty()
  fcmToken: string;
  @IsNotEmpty()
  @ApiProperty()
  deviceName: string;
  @IsNotEmpty()
  @ApiProperty()
  deviceId: string;
  @IsNotEmpty()
  @ApiProperty()
  provider: string;
}
