import { Router, Request, Response } from "express";
import UserController from "../controllers/userController";
import { AuthRequest } from "../types/authRequest";
import { auth, isProd } from "../middlewares/auth";

const prodRouter = Router();

prodRouter.get(
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

module.exports = prodRouter;
