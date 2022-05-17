import { Event, IEvent } from "../schemas/Event";
import mongoose from "mongoose";
import { Get, Post, Tags, Body, Path, Route } from "tsoa";
@Route("api/v1/event")
@Tags("event")
export default class EventController {
  @Post("/")
  async createEvent(@Body() data: IEvent): Promise<IEvent> {
    /*
    Crea un evento a partir de los parámetros recibidos en el json data. Se filtran los errores posibles diferenciando 
    sus mensajes de error y en caso de exito se retorna el modelo evento.
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
}
