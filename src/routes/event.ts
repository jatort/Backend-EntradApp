import { Router, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import EventController from "../controllers/eventController";
import { auth, isProd } from "../middlewares/auth";
import { User } from "../schemas/User";

const eventRouter = Router();

/*
  EVENTOS  
*/
eventRouter.post("/", auth, isProd, async (req: AuthRequest, res: Response) => {
  /*
  Endpoint para crear eventos, en caso de exito retorna los datos del nuevo modelo evento, en caso contrario se retorna el código 400
  con el mensaje específico de la causa del error.
  */
  const controller = new EventController();
  try {
    req.body.user = await User.findOne({ email: req.user?.email });
    const event = await controller.createEvent(req.body);
    return res.status(201).json({ event });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});

eventRouter.get("/", async (req: Request, res: Response) => {
  /*
  Endpoint para obtener todos los eventos, en caso de exito retorna los datos de los eventos, en caso contrario se retorna el código 400
  con el mensaje específico de la causa del error.
  */
  const controller = new EventController();
  try {
    const events = await controller.getEvents();
    return res.status(200).json({ events });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});

eventRouter.get("/:id", async (req: Request< {id: string} >, res: Response) => {
  /*
  Endpoint para obtener el evento de id 'id', en caso de exito retorna los datos del evento, en caso contrario se retorna el código 400
  con el mensaje específico de la causa del error.
  */
  const controller = new EventController();
  try {
    const event = await controller.getEvent(req.params.id);
    return res.status(200).json({ event });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});

/*
  FIN EVENTOS
*/

module.exports = eventRouter;
