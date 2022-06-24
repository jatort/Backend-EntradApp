import { Router, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import OrderController from "../controllers/orderController";
import { auth, isClient } from "../middlewares/auth";
import UserController from "../controllers/userController";
import EventController from "../controllers/eventController";
import { Event } from "../schemas/Event";
import { User } from "../schemas/User";

const orderRouter = Router();

orderRouter.post(
  "/",
  auth,
  isClient,
  async (req: AuthRequest, res: Response) => {
    /*
  Endpoint para comprar tickets el evento de id 'eventId'
  */

    const controller = new OrderController();
    const userController = new UserController();
    const eventController = new EventController();
    try {
      const order = await controller.bookTickets(
        req.body.eventId,
        req.body.nTickets,
        req.user?.email
      );
      const event = await eventController.getById(req.body.eventId);
      const prod = await userController.getUserbyId(event.user);
      const redirect = await controller.createFlowOrder(
        order,
        prod,
        req.user?.email
      );
      res.status(200).json({ redirect });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
);

orderRouter.get(
  "/",
  auth,
  isClient,
  async (req: AuthRequest, res: Response) => {
    /*
    Endpoint para obtener el historial de compra de un usuario
  */

    const orderController = new OrderController();
    const userController = new UserController();
    try {
      const user = await userController.getClient(req.user!.email);
      const orders = await orderController.getOrders(user._id);
      return res.status(200).json({ orders });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
);

orderRouter.post("/result", async (req: Request, res: Response) => {
  try {
    const controller = new OrderController();
    // Se obtiene el estado de la orden de Flow.
    const response = await controller.receiveFlowOrder(req.body.token);
    const order = await controller.getOrder(response.commerceOrder);
    const message = await controller.createTickets(order, response.status);
    res.write(
      `<h1 style="font-size: 48px; text-align: center; justify-content: center;">${message}</h1>`
    );
  } catch (error: any) {
    res.json({ error });
  }
});

orderRouter.post("/paymentConfirm", async (req: Request, res: Response) => {
  try {
    const controller = new OrderController();
    // Se obtiene el estado de la orden de Flow.
    const response = await controller.receiveFlowOrder(req.body.token);
    // Se obtiene la orden a partir del estado de la orden de Flow
    const order = await controller.getOrder(response.commerceOrder);
    // Se generan los tickets correspondientes a la compra.
    const message = await controller.createTickets(order, response.status);
    res.write(
      `<h1 style="font-size: 48px; text-align: center; justify-content: center;">${message}</h1>`
    );
  } catch (error: any) {
    res.json({ error });
  }
});

module.exports = orderRouter;
