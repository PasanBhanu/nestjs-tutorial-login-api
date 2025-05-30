import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/UserSchema';
import { OtpSession, OtpSessionSchema } from '../database/schemas/OtpSession';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET_TEMPORARY,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: OtpSession.name,
        schema: OtpSessionSchema,
      },
    ]),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
