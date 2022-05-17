import { Router, Response, Request } from "express";
import { User } from "../schemas/User";
import { AuthRequest } from "../types/authRequest";
import { loginUser, generateToken } from "../controllers/loginController";
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;
   
  const { message, user } = await loginUser(email, password);
  if (user == null || user == undefined) return res.status(400).json({error: message});

  const token = generateToken(user)!;

  res.json({ token, message});
});

module.exports = loginRouter;
