import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  phone: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
