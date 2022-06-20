import { Router, Response, Request } from "express";
import TicketController from "../controllers/ticketController";
import UserController from "../controllers/userController";
import { auth, isClient } from "../middlewares/auth";
import { AuthRequest } from "../types/authRequest";

const ticketRouter = Router();

ticketRouter.get("/", auth, isClient, async (req: AuthRequest, res: Response) => {
  /*
    Endpoint para obtener los tickets de un usuario
  */

    const ticketController = new TicketController();
    const userController = new UserController();
    try {
      const user = await userController.getClient(req.user!.email);
      const tickets = await ticketController.getTickets(user._id);
      return res.status(200).json({orders});
    } catch (err: any) {
      return res.status(400).json({message: err.message});
    }
});
module.exports = ticketRouter;
