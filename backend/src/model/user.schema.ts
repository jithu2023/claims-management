// models/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['User', 'Insurer'] })
  role: string;

  @Prop()
  insurerId?: string; // ✅ Only needed if the role is Insurer
}

export const UserSchema = SchemaFactory.createForClass(User);
