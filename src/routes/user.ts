import { Router, Request, Response } from "express";
import UserController from "../controllers/userController";

const userRouter = Router();

userRouter.post("/", async (req: Request, res: Response) => {
  const controller = new UserController();
  try {
    const response = await controller.createUser(req.body);
    return res.send(response);
  } catch (err: any) {
    return res.status(400).send(err.message);
  }
});

module.exports = userRouter;
