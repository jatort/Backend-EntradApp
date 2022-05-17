import { Router, Request, Response } from "express";
import EventController from "../controllers/eventController";

const eventRouter = Router();

/*
  EVENTOS  
*/
eventRouter.post("/", async (req: Request, res: Response) => {
  /*
  Endpoint para crear eventos, en caso de exito retorna los datos del nuevo modelo evento, en caso contrario se retorna el código 400
  con el mensaje específico de la causa del error.
  */
  const controller = new EventController();
  try {
    const event = await controller.createEvent(req.body);
    return res.status(201).json({ event });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});
/*
  FIN EVENTOS
*/

module.exports = eventRouter;
