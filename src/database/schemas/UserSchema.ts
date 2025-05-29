import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  _id: false,
  timestamps: true,
})
export class FirebaseLink {
  @Prop()
  id: string;
  @Prop()
  provider: string;
}

export const FirebaseLinkSchema = SchemaFactory.createForClass(FirebaseLink);

@Schema({
  _id: false,
  timestamps: true,
})
export class Device {
  @Prop()
  deviceId: string;
  @Prop()
  deviceName: string;
  @Prop()
  fcmToken: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  mobileNumber: string;
  @Prop()
  imageUrl: string;
  @Prop()
  status: number;
  @Prop()
  hasPassword: boolean;
  @Prop([FirebaseLinkSchema])
  firebaseLinks: FirebaseLink[];
  @Prop([DeviceSchema])
  devices: Device[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocumentOverride = {
  firebaseLinks: Types.DocumentArray<FirebaseLink>;
  devices: Types.DocumentArray<Device>;
};
export type UserDocument = HydratedDocument<User, UserDocumentOverride>;

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ mobileNumber: 1 }, { unique: true });
UserSchema.index({ 'firebaseLinks.id': 1 }, { unique: true, sparse: true });
