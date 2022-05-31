import { Router, Request, Response } from "express";
import UserController from "../controllers/userController";
import { AuthRequest } from "../types/authRequest";
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

userRouter.get(
  "/myevents",
  auth,
  isProd,
  async (req: AuthRequest, res: Response) => {
    const controller = new UserController();
    try {
      const events = await controller.getMyEvents(req.user?.email);
      return res.status(200).json({ events });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
);

module.exports = userRouter;
