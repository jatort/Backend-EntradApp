import Router from "express";
const userRoutes = require("./user");
const eventRoutes = require("./event");

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/event", eventRoutes);

export default routes;
