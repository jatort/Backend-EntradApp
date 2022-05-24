import Router from "express";
const userRoutes = require("./user");
const loginRoutes = require("./login");
const eventRouter = require("./event");

const routes = Router();
routes.use("/user", userRoutes);
routes.use("/login", loginRoutes);
routes.use("/event", eventRouter);

export default routes;