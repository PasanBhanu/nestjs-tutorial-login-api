import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/UserSchema';
import { RegistrationService } from './registration.service';
import { PhoneAuthentication, PhoneAuthenticationSchema } from '../database/schemas/PhoneAuthenticationSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PhoneAuthentication.name, schema: PhoneAuthenticationSchema },
    ]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
