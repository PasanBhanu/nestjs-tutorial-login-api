import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../database/schemas/UserSchema';
import { Model } from 'mongoose';
import { UserDetailsResponse } from './dto/response/user.response.dto';

@Injectable()
export default class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async appUserInformation(req): Promise<UserDetailsResponse> {
    // Get Firebase ID from Token
    const firebaseId: string = req.tokenContext.user_id;
    this.logger.log(`Getting User Information for: ${firebaseId}`);

    const user = await this.userModel.findOne({ 'firebaseLinks.id': firebaseId }).exec();
    if (!user) {
      throw new NotFoundException();
    }

    const response = new UserDetailsResponse();
    response.id = user._id.toString();
    response.email = user.email;
    response.mobileNumber = user.mobileNumber;
    response.name = user.name;
    response.imageUrl = user.imageUrl;
    response.hasPassword = user.hasPassword;
    response.status = user.status;

    return response;
  }
}
