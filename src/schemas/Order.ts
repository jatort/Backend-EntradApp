import { Schema, Types, model } from "mongoose";

export interface IOrder {
  user: Types.ObjectId;
  event: Types.ObjectId;
  nTickets: number;
  amount: number;
  currency: string;
  commerceOrder: string;
  isPending: boolean;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  nTickets: { type: Number, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true},
  commerceOrder: {type: String, required: true},
  isPending: { type: Schema.Types.Boolean, required: true}
});

export const Order = model<IOrder>("Order", OrderSchema);
