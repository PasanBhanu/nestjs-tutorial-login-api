import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class CommonResponse {
  @ApiProperty()
  statusCode: number = HttpStatus.OK;
}
