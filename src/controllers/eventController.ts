import { Event, IEvent, IPublishEvent } from "../schemas/Event";
import { User } from "../schemas/User";
import mongoose from "mongoose";

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
      if (err.code === 11000) {
        throw new Error("event already exists");
      } else if (err == mongoose.Error.ValidationError) {
        throw new Error("Invalid event data");
      } else {
        throw new Error("Unknown Event Error");
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
  async getMyEvents(user_email: any): Promise<IEvent[]> {
    /*
    Retorna los eventos creados por un usuario productor
    */
    const user = await User.findOne({ email: user_email });
    if (!user) {
      throw new Error("User not found");
    }
    const events = await Event.find({ user: user._id });
    if (events.length === 0) {
      throw new Error("No events found");
    } else {
      return events;
    }
  }
}
