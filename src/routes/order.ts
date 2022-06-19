import { Router, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import OrderController from "../controllers/orderController";
import { auth, isClient } from "../middlewares/auth";

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
    try {
      const order = await controller.bookTickets(
        req.body.eventId,
        req.body.nTickets,
        req.user?.email
      );
      const redirect = await controller.createFlowOrder(order, req.user?.email);
      res.status(200).json({ redirect });
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
