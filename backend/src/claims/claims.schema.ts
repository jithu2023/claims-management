// models/claims.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClaimDocument = Claim & Document;

@Schema({ timestamps: true })
export class Claim {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  claimAmount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] })
  status: string;

  @Prop()
  approvedAmount?: number;

  @Prop()
  insurerComments?: string;

  @Prop()
  documentUrl?: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
