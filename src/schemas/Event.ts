import { Date, Schema, Types, model } from "mongoose";

export interface IEvent{
  name: string;
  category: string;
  date: Date;
  dateLimitBuy: Date;
  description: string;
  nTickets: number;
  image_url: string;
  user: Types.ObjectId;
}

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  category: { type: String, required: true},
  date: { type: Date, required: true },
  dateLimitBuy: { type: Date, required: true },
  description: { type: String, required: false },
  nTickets: { type: Number, required: true },
  image_url: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Event = model<IEvent>("Event", EventSchema);