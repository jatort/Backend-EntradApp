import { Router, Request, Response } from "express";
import UserController from "../controllers/userController";
import { AuthRequest } from "../types/authRequest";
import { auth } from "../middlewares/auth";

const profileRouter = Router();

profileRouter.get("/", auth, async (req: AuthRequest, res: Response) => {
  /*
  Endpoint para obtener el usuario autentificado, en caso de exito retorna los datos del usuario, en caso contrario se retorna 
  el código 400 con el mensaje específico de la causa del error.
  */
  const controller = new UserController();
  try {
    const user = await controller.getProfile(req.user?.email);
    return res.status(200).json({ user });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;
