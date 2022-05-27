import { Router, Response, Request } from "express";
import { LoginController } from "../controllers/loginController";

const loginRouter = Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const controller = new LoginController();
  const { message, token } = await controller.loginUser(req.body);
  if (token == null || token == undefined)
    return res.status(400).json({ error: message });
  res.json({ token, message });
});

module.exports = loginRouter;
