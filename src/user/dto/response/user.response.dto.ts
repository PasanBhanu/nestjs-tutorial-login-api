import { CommonResponse } from '../../../shared/dto/common-response.dto';

export class UserDetailsResponse extends CommonResponse {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  imageUrl: string;
  status: number;
  hasPassword: boolean;
}
