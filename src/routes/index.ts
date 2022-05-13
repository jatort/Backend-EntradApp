import Router from "express";
const userRoutes = require("./user");


const routes = Router();
routes.use("/user", userRoutes);

export default routes;
