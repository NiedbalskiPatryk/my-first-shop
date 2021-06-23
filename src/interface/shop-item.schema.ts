import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ItemShop extends Document {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  price: number;
  @Prop()
  createdAd: Date;
  @Prop()
  boughtCounter: number;
  @Prop()
  wasEverBought: boolean;
}

export const ItemShopSchema = SchemaFactory.createForClass(ItemShop);
