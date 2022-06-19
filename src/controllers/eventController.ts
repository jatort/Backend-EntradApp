import { Event, IEvent, IPublishEvent } from "../schemas/Event";
import mongoose from "mongoose";
import { Ticket } from "../schemas/Ticket";
import { IOrder, Order } from "../schemas/Order";
import { User } from "../schemas/User";

export default class EventController {
  async createEvent(data: IPublishEvent): Promise<IEvent> {
    /**
     * Crea un evento a partir de los parámetros recibidos en el body. Se filtran los errores posibles diferenciando
     * sus mensajes de error y en caso de exito se retorna el modelo evento.
     */
    const event = new Event(data);
    try {
      await event.save();
      return event;
    } catch (err: any) {
      if (err == mongoose.Error.ValidationError) {
        throw new Error("Invalid event data");
      } else {
        throw new Error("Error: " + err.message);
      }
    }
  }
  async getEvents(): Promise<IEvent[]> {
    /*
    Retorna todos los eventos.
    */
    const today = new Date();
    const events = await Event.find({ date: { $gte: today } });
    if (events.length === 0) {
      throw new Error("No events found");
    } else {
      return events;
    }
  }

  async getEvent(id: string): Promise<IEvent> {
    /*
    Retorna el evento de id: 'id'
    */
    const event = await Event.findById(id);
    if (event == null) {
      throw new Error("No events found");
    } else {
      return event;
    }
  }

  async buyTickets(id: string, nTickets: number, userEmail: string | undefined): Promise<IOrder> {
    /*
      Crea una orden y redirige a Flow
    */
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("No user found");
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new Error("No event found");
    }

    if (event.nTickets <= 0) {
      throw new Error("No tickets available");
    }

    if (event.nTickets - event.currentTickets < nTickets){
      throw new Error(`Only ${event.nTickets - event.currentTickets} available`);
    }

    let orderData = {
      user: user._id,
      event: event._id,
      nTickets: nTickets,
      amount: nTickets * event.price,
      currency: "CLP",
      isPending: true,
      commerceOrder: Math.floor(Math.random() * (2000 - 1100 + 1)) + 1100,
    };

    const order = new Order(orderData);

    try {
      await order.save();
      await event.updateOne({currentTickets: event.currentTickets + nTickets});
      return order;
    } catch (err: any) {
      if (err == mongoose.Error.ValidationError) {
        throw new Error("Invalid order data");
      } else {
        throw new Error("Unknown Order Error");
      }
    }
  }
}
