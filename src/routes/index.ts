import Router from "express";
const userRoutes = require("./user");
const loginRoutes = require("./login");

const routes = Router();
routes.use("/user", userRoutes);
routes.use("/login", loginRoutes);

export default routes;
