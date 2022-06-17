import { Date, Schema, Types, model } from "mongoose";

export interface ITicket {
  user: Types.ObjectId;
  event: Types.ObjectId;
  purchaseDate: Date;
  code: string;
  price: number;
  order: Types.ObjectId;
}

const TicketSchema = new Schema<ITicket>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  purchaseDate: { type: Date, required: false, default: "" },
  price: { type: Number, required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
});

export const Ticket = model<ITicket>("Ticket", TicketSchema);
