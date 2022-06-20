import { Event } from "../schemas/Event";
import { User } from "../schemas/User";
import { IOrder, Order } from "../schemas/Order";
import { ITicket, Ticket } from "../schemas/Ticket";
import { Types } from "mongoose";

export default class TicketController {
  async getTickets(
    userId: Types.ObjectId
  ): Promise<ITicket[]> {
    /*
      Obtiene los tickets de un usuario
    */
    try {
      const tickets = await Ticket.find({user: userId}).populate("event");
      return tickets;
    } catch (err: any) {
      throw new Error(`Error: ${err.message}`)
    }
  }
}
