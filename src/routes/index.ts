import Router from "express";
const userRoutes = require("./user");
import swaggerUi from "swagger-ui-express";
import PingController from "../controllers/pingController";
const routes = Router();

routes.use("/user", userRoutes);

routes.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

export default routes;
