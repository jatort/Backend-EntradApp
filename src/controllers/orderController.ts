import { Event } from "../schemas/Event";
import { User } from "../schemas/User";
import { Ticket } from "../schemas/Ticket";
import { IOrder, Order } from "../schemas/Order";
import { Types } from "mongoose";
import mongoose from "mongoose";

const FlowApi = require("flowcl-node-api-client");
const config = require("../routes/config.ts");

export default class OrderController {
  async bookTickets(
    id: string,
    nTickets: number,
    userEmail: string | undefined
  ): Promise<IOrder> {
    /*
      Crea una orden
    */
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("No user found");
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new Error("No event found");
    }

    if (event.nTickets <= 0) {
      throw new Error("No tickets available");
    }

    if (event.nTickets - event.currentTickets < nTickets) {
      throw new Error(
        `Only ${event.nTickets - event.currentTickets} available`
      );
    }

    let orderData = {
      user: user._id,
      event: event._id,
      nTickets: nTickets,
      amount: nTickets * event.price,
      currency: "CLP",
      isPending: true,
      commerceOrder: Math.floor(Math.random() * (2000 - 1100 + 1)) + 1100,
    };

    const order = new Order(orderData);

    try {
      await order.save();
      await event.updateOne({
        currentTickets: event.currentTickets + nTickets,
      });
      return order;
    } catch (err: any) {
      if (err == mongoose.Error.ValidationError) {
        throw new Error("Invalid order data");
      } else {
        throw new Error("Unknown Order Error");
      }
    }
  }

  async createFlowOrder(
    order: IOrder,
    email: string | undefined
  ): Promise<string> {
    /*
      Crea una orden en Flow y redirige a la ventana de pago
    */
    const params = {
      commerceOrder: order.commerceOrder,
      subject: "Pago EntradApp",
      currency: order.currency,
      amount: order.amount,
      email: email,
      paymentMethod: 9,
      urlConfirmation: config.baseURL + "/order/paymentConfirm",
      urlReturn: config.baseURL + "/order/result",
    };
    const serviceName = "payment/create";
    // Instancia la clase FlowApi
    const flowApi = new FlowApi(config);
    try {
      // Ejecuta el servicio
      let response = await flowApi.send(serviceName, params, "POST");
      //Prepara url para redireccionar el browser del pagador
      const redirect = response.url + "?token=" + response.token;
      return redirect;
    } catch (err: any) {
      throw new Error("Error: " + err.message);
    }
  }

  async receiveFlowOrder(token: string): Promise<any> {
    /*
      Obtiene el estado de la orden en Flow
    */
    let params = {
      token: token,
    };
    let serviceName = "payment/getStatus";
    const flowApi = new FlowApi(config);
    try {
      let response = await flowApi.send(serviceName, params, "GET");
      return response;
    } catch (err: any) {
      throw new Error("Connection with FLOW refused");
    }
  }

  async getOrder(
    commerceOrder: string
  ): Promise<IOrder & { _id: Types.ObjectId }> {
    /*
      Obtiene la orden desde la BDD
    */
    const order = await Order.findOne({ commerceOrder: commerceOrder });
    if (!order) {
      throw new Error(`Order not found`);
    }
    return order;
  }

  async createTickets(
    order: IOrder & { _id: Types.ObjectId },
    status: any
  ): Promise<string | undefined> {
    /*
      En el caso que la orden de Flow tenga status 2 (aprobada), crea los tickets
      correspondientes a la orden, en caso de que la orden fuera rechazada (status 3 o 4),
      devuelve los tickets reservados y en caso de estar pendiente la orden en Flow, 
      no hace nada.
    */
    if (!order.isPending) return "Sus tickets ya han sido creados.";
    if (status == 2) {
      const event = await Event.findById(order.event);
      for (let i = 0; i < order.nTickets; i++) {
        let ticketData = {
          user: order.user,
          event: order.event,
          purchaseDate: new Date(),
          price: order.amount / order.nTickets,
          order: order._id,
          date: event?.date,
        };
        const ticket = new Ticket(ticketData);
        await ticket.save();
      }
      await Order.findOneAndUpdate({ _id: order._id }, { isPending: false });
      let message =
        "Transacción exitosa, puedes ver tus entradas en Mis Tickets!";
      return message;
    } else {
      const event = await Event.findById(order.event);
      if (!event) {
        throw new Error(`Evento no encontrado.`);
      }
      if (status == 1) {
        // Transacción pendiente
        throw new Error(
          "Transacción pendiente: Si la compra es existosa, tus entradas serán asignadas automáticamente"
        );
      } else if (status == 3) {
        // Transacción rechazada
        await Event.findOneAndUpdate(
          { _id: event._id },
          {
            currentTickets: event.currentTickets - order.nTickets,
          }
        );
        throw new Error("Transaccioń rechazada: Vuelva a intentarlo.");
      } else if (status == 4) {
        // Transacción anulada
        await Event.findOneAndUpdate(
          { _id: event._id },
          {
            currentTickets: event.currentTickets - order.nTickets,
          }
        );
        throw new Error("Transacción anulada: Vuelva a intentarlo.");
      }
    }
  }
}
