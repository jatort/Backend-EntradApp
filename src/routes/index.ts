import Router from "express";
const userRoutes = require("./user");
const loginRoutes = require("./login");
const eventRouter = require("./event");
const prodRouter = require("./producer");
const orderRouter = require("./order");

const routes = Router();
routes.use("/user", userRoutes);
routes.use("/login", loginRoutes);
routes.use("/event", eventRouter);
routes.use("/prod", prodRouter);
routes.use("/order", orderRouter);

export default routes;
