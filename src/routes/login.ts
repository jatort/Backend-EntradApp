import { Router, Response, Request } from "express";
import { User } from "../schemas/User";
import { AuthRequest } from "../types/authRequest";
import { LoginController } from "../controllers/loginController";
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

const loginRouter = Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const controller = new LoginController();
  const { message, user } = await controller.loginUser(req.body);
  if (user == null || user == undefined)
    return res.status(400).json({ error: message });

  const token = controller.generateToken(user)!;

  res.json({ token, message });
});

module.exports = loginRouter;
