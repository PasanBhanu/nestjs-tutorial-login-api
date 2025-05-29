import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './UserSchema';

@Schema({ timestamps: true })
export class PhoneAuthentication {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;

  @Prop()
  phoneNumber: string;

  @Prop()
  hash: string;
}

export const PhoneAuthenticationSchema = SchemaFactory.createForClass(PhoneAuthentication);

PhoneAuthenticationSchema.index({ phoneNumber: 1 }, { unique: true });
PhoneAuthenticationSchema.index({ userId: 1 }, { unique: true });
