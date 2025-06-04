import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../../shared/dto/common-response.dto';

export class CheckuserResponse extends CommonResponse {
  @ApiProperty()
  registrationComplete: boolean;
}
