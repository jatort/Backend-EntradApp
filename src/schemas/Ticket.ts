import { Date, Schema, Types, model } from "mongoose";

export interface ITicket {
  user: Types.ObjectId;
  event: Types.ObjectId;
  purchaseDate: Date;
  code: string;
  price: number;
}

const TicketSchema = new Schema<ITicket>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  purchaseDate: { type: Date, required: false, default: "" },
  code: { type: String, required: false },
  price: { type: Number, required: true },
});

export const Ticket = model<ITicket>("Ticket", TicketSchema);
