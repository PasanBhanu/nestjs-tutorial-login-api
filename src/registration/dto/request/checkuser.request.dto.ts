import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckuserRequest {
  @IsNotEmpty()
  @ApiProperty()
  provider: string;
  @IsNotEmpty()
  @ApiProperty()
  value: string;
}
