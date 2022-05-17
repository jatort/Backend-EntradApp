import Router from "express";
const userRoutes = require("./user");
import swaggerUi from "swagger-ui-express";
const routes = Router();

routes.use("/user", userRoutes);

export default routes;
