import { Router, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import OrderController from "../controllers/orderController";
import { auth, isClient } from "../middlewares/auth";

const orderRouter = Router();


orderRouter.post("/", auth, isClient, async (req: AuthRequest, res: Response) => {
  /*
  Endpoint para comprar tickets el evento de id 'eventId'
  */

  const controller = new OrderController();
  try {
    const order = await controller.buyTickets(req.body.eventId, req.body.quantity, req.user?.email);
    const redirect = await controller.createFlowOrder(order, req.user?.email)
    res.redirect(redirect);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});

orderRouter.post("/result", async (req: Request, res: Response) => {
  try {
    const controller = new OrderController();
    // Se obtiene el estado de la orden de Flow.
    const response = await controller.receiveFlowOrder(req.body.token);
    // Se obtiene la orden a partir del estado de la orden de Flow
    const order = await controller.getOrder(response.commerceOrder);
    // Se generan los tickets correspondientes a la compra.
    const message = await controller.createTickets(order, response.status);
    res.status(200).json({message: message});
  } catch (error: any) {
    res.json({ error });
  }
});

orderRouter.post(
  "/payment_confirm",
  async (req: Request, res: Response) => {
    try {
      const controller = new OrderController();
      // Se obtiene el estado de la orden de Flow.
      const response = await controller.receiveFlowOrder(req.body.token);
      // Se obtiene la orden a partir del estado de la orden de Flow
      const order = await controller.getOrder(response.commerceOrder);
      // Se generan los tickets correspondientes a la compra.
      const message = await controller.createTickets(order, response.status);
      res.status(200).json({message: message});
    } catch (error: any) {
      res.json({ error });
    }
  }
);

module.exports = orderRouter;
