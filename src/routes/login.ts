import { Router, Response, Request } from "express";
import { User } from "../schemas/User";
import { AuthRequest } from "../types/auth-request";
const auth = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Validacion de existencia del usuario
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({error: "User not found"});

  // Validacion de la contrasena
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) return res.status(400).json({error: "Password is invalid"});
  
  // Generacion del JSON Web Token
  const token: string = jwt.sign({
    email: user.email,
    id: user._id,
    role: user.role,
  }, process.env.TOKEN);

  res.json({data: { token }, message: "success"});
});

module.exports = loginRouter;
