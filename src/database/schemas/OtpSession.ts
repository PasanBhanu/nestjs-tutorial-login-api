import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class OtpSession {
  @Prop()
  otp: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  token: string;
  @Prop()
  attempts: number;
  @Prop()
  sendAttempts: number;
  @Prop()
  status: number;
}

export const OtpSessionSchema = SchemaFactory.createForClass(OtpSession);
