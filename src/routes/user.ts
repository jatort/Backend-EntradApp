import { Router, Request, Response } from  "express";
import { createUser } from "../controllers/userController";

const userRouter = Router();

/*
  USUARIOS
*/
userRouter.post("/", async (req: Request, res: Response) => {
  /*
  Endpoint para crear usuarios, en caso de exito retorna los datos del nuevo modelo usuario, en caso contrario se retorna el código 400
  con el mensaje específico de la causa del error.
  */
  try {
    const user = await createUser(req.body);
    return res.status(201).json({ user });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});
/*
  FIN USUARIOS
*/

module.exports = userRouter;
