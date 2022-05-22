import { Date, Schema, Types, model } from "mongoose";

export interface IEvent {
  name: string;
  category: string;
  date: Date;
  dateLimitBuy: Date;
  description: string;
  nTickets: number;
  imageUrl: string;
  user: Types.ObjectId;
  price: number;
}

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  dateLimitBuy: { type: Date, required: true },
  description: { type: String, required: false },
  nTickets: { type: Number, required: true },
  imageUrl: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
});

EventSchema.pre("save", async function save(next) {
  if (this.dateLimitBuy <= this.date) return next();
  const err = new Error("'date' must be more than 'dateLimitBuy'");
  return next(err);
});

export const Event = model<IEvent>("Event", EventSchema);
