import { Router, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import EventController from "../controllers/eventController";
import UserController from "../controllers/userController";
import { auth, isProd } from "../middlewares/auth";
import { User } from "../schemas/User";

const FlowApi = require("flowcl-node-api-client");
const config = require("./config.ts");

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
  const userController = new UserController();
  try {
    req.body.user = await userController.getProd(req.user?.email);
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

eventRouter.post(
  "/apiFlow/create_order",
  async (req: Request, res: Response) => {
    /**
     * Ejemplo de creación de una orden de cobro, iniciando una transacción de pago
     * Utiliza el método payment/create
     */

    //Para datos opcionales campo "optional" prepara un arreglo JSON
    const optional = {
      rut: "9999999-9",
      otroDato: "otroDato",
    };
    //Prepara el arreglo de datos
    const params = {
      commerceOrder: Math.floor(Math.random() * (2000 - 1100 + 1)) + 1100,
      subject: "Pago de prueba",
      currency: "CLP",
      amount: 5000,
      email: "efuentealba@json.cl",
      paymentMethod: 9,
      urlConfirmation: config.baseURL + "/payment_confirm",
      urlReturn: config.baseURL + "/result",
      ...optional,
    };
    //Define el metodo a usar
    const serviceName = "payment/create";

    try {
      // Instancia la clase FlowApi
      const flowApi = new FlowApi(config);
      // Ejecuta el servicio
      let response = await flowApi.send(serviceName, params, "POST");
      //Prepara url para redireccionar el browser del pagador
      const redirect = response.url + "?token=" + response.token;
      res.redirect(redirect);
    } catch (error: any) {
      console.log(error.message);
    }
  }
);

eventRouter.post(
  "/apiFlow/payment_confirm",
  async (req: Request, res: Response) => {
    try {
      let params = {
        token: req.body.token,
      };
      console.log(
        "el token creo que puede ser o bien",
        req.body.token,
        "o si no",
        req.query.token
      );
      let serviceName = "payment/getStatus";
      const flowApi = new FlowApi(config);
      let response = await flowApi.send(serviceName, params, "GET");
      //Actualiza los datos en su sistema
      // console.log(response);
      res.json(response);
    } catch (error: any) {
      res.json({ error });
    }
  }
);

eventRouter.post("/apiFlow/result", async (req: Request, res: Response) => {
  try {
    let params = {
      token: req.body.token,
    };
    let serviceName = "payment/getStatus";
    const flowApi = new FlowApi(config);
    let response = await flowApi.send(serviceName, params, "GET");
    //Actualiza los datos en su sistema
    console.log("response es", response);
    res.json(response);
  } catch (error: any) {
    res.json({ error });
  }
});

eventRouter.post(
  "/apiFlow/create_email",
  async (req: Request, res: Response) => {
    //Prepara los parámetros
    const params = {
      commerceOrder: Math.floor(Math.random() * (2000 - 1100 + 1)) + 1100,
      subject: "pago prueba cobro Email",
      currency: "CLP",
      amount: 2000,
      email: "efuentealba@json.cl",
      paymentMethod: 9,
      urlConfirmation: config.baseURL + "/payment_confirm",
      urlReturn: config.baseURL + "/result",
      forward_days_after: 1,
      forward_times: 2,
    };
    const serviceName = "payment/createEmail";
    try {
      const flowApi = new FlowApi(config);

      let response = await flowApi.send(serviceName, params, "POST");

      res.json({
        response,
      });
    } catch (error: any) {
      console.log(error);
      res.json({ error: error });
    }
  }
);

eventRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
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
