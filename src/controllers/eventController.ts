import { Event, IEvent, IPublishEvent } from "../schemas/Event";
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
      if (err == mongoose.Error.ValidationError) {
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

  async getEvent(id: string): Promise<IEvent> {
    /*
    Retorna el evento de id: 'id'
    */
    const event = await Event.findById(id);
    if (event == null){
      throw new Error("No events found");
    } else {
      return event;
    }
  }
}
