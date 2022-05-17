import Router from "express";
const userRoutes = require("./user");
const loginRoutes = require("./login");
const eventRoutes = require("./event");

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/login", loginRoutes);
routes.use("/event", eventRoutes);

export default routes;
