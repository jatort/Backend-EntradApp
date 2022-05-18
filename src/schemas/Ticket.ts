import { Date, Schema, Types, model } from "mongoose";
import { Interface } from "readline";

export interface ITicket {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  purchaseDate: Date;
  code: string;
  price: number;
}

const TicketSchema = new Schema<ITicket>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  purchaseDate: { type: Date, required: false, default: "" },
  code: { type: String, required: false },
  price: { type: Number, required: true },
});

export const Ticket = model<ITicket>("Ticket", TicketSchema);
