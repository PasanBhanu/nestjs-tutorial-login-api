import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../../shared/dto/common-response.dto';

export class ValidateOtpResponse extends CommonResponse {
  @ApiProperty()
  hash: string;
}
