import { Router, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import EventController from "../controllers/eventController";
import { auth, isClient } from "../middlewares/auth";
import { Order } from "../schemas/Order";
import { Ticket } from "../schemas/Ticket";
import { Event } from "../schemas/Event";

const FlowApi = require("flowcl-node-api-client");
const config = require("./config.ts");

const orderRouter = Router();


orderRouter.post("/", auth, isClient, async (req: AuthRequest, res: Response) => {
  /*
  Endpoint para comprar tickets el evento de id 'id'
  */

  const controller = new EventController();
  try {

    const order = await controller.buyTickets(req.body.eventId, req.body.quantity, req.user?.email);

    const params = {
      commerceOrder: order.commerceOrder,
      subject: "Pago EntradApp",
      currency: order.currency,
      amount: order.amount,
      email: req.user?.email,
      paymentMethod: 9,
      urlConfirmation: config.baseURL + "/payment_confirm",
      urlReturn: config.baseURL + "/result"
    };

    const serviceName = "payment/create";
    // Instancia la clase FlowApi
    const flowApi = new FlowApi(config);
    // Ejecuta el servicio
    let response = await flowApi.send(serviceName, params, "POST");
    //Prepara url para redireccionar el browser del pagador
    const redirect = response.url + "?token=" + response.token;
    res.redirect(redirect);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});

orderRouter.post("/result", async (req: Request, res: Response) => {
  try {
    let params = {
      token: req.body.token,
    };
    let serviceName = "payment/getStatus";
    const flowApi = new FlowApi(config);
    let response = await flowApi.send(serviceName, params, "GET");    //// Esta es la respuesta que retorna FLOW  2 Salió todo bien
    const order = await Order.findOne({ commerceOrder: response.commerceOrder })
    if(!order){
      throw new Error(`Order not found`);
    }

    if (response.status == 2) {
      for (let i = 0; i < order.nTickets; i++){
        let ticketData = {
          user: order.user,
          event: order.event,
          purchaseDate: new Date(),
          price: order.amount / order.nTickets,
          order: order._id,
        }
        const ticket = new Ticket(ticketData);
        await ticket.save();
        res.status(200).json({message: "Transaction successful"});
      }
      await order.updateOne({isPending: false});

    } else {
      const event = await Event.findById(order.event);
      if(!event){
        throw new Error(`Event not found`);
      }
      await event.updateOne({currentTickets: event.currentTickets - order.nTickets});

      if (response.status == 1) {
        throw new Error("Pending transaction");
      } else if (response.status == 3) {
        throw new Error("Rejected");
      } else if (response.status == 4) {
        throw new Error("Void transaction");
      }
    }
  } catch (error: any) {
    res.json({ error });
  }
});


module.exports = orderRouter;
