import { Event, IEvent, IPublishEvent } from "../schemas/Event";
import mongoose, { Date } from "mongoose";
import {
  Get,
  Post,
  Tags,
  Body,
  Path,
  Route,
  Controller,
  Security,
  Header,
} from "tsoa";
@Route("api/v1/event")
@Tags("event")
export default class EventController {
  @Post("/")
  @Security("jwt", ["producer"])
  async createEvent(@Body() data: IPublishEvent): Promise<IEvent> {
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
  @Get("/")
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
}
