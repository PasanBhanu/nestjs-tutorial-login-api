import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RegistrationModule } from './registration/registration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

const logger = new Logger('App Module');

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(<string>process.env.MONGODB_SRN, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => logger.log(`Database ${connection.id} Connected: ${connection.host}`));
        connection.on('disconnected', () => logger.log(`Database ${connection.id} Disconnected: ${connection.host}`));
        connection.on('reconnected', () => logger.log(`Database ${connection.id} Reconnected: ${connection.host}`));

        return connection;
      },
    }),
    LoginModule,
    UserModule,
    RegistrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
