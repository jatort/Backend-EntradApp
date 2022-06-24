import { Router, Request, Response } from "express";
import UserController from "../controllers/userController";
import { AuthRequest } from "../types/authRequest";
import { UserResponse } from "../types/userResponse";
import { auth, isProd } from "../middlewares/auth";

const userRouter = Router();

userRouter.post("/", async (req: Request, res: Response) => {
  const controller = new UserController();
  try {
    const response = await controller.createUser(req.body);
    return res.status(201).send(response);
  } catch (err: any) {
    return res.status(400).send({ message: err.message });
  }
});

userRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  /*
  Endpoint para obtener el usuario de id 'id', en caso de exito retorna los datos del evento, en caso contrario se retorna el código 400
  con el mensaje específico de la causa del error.
  */
  const controller = new UserController();
  try {
    const user = await controller.getUser(req.params.id);
    return res.status(200).json({ user });
  } catch (err: any) {
    return res.status(400).json({ message: err });
  }
});

userRouter.delete("/", auth, async (req: AuthRequest, res: Response) => {
  const controller = new UserController();
  try {
    const response = await controller.deleteUser(req.user?.email);
    return res.status(202).send(response);
  } catch (err: any) {
    return res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
