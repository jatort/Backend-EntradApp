import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const app = express();

app.use(express.json()); // for parsing application/json
app.use(morgan("tiny")); // routes log
app.use(express.static("public")); // static files

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use("/api/v1/", routes);

async function run() {
  // Connect to MongoDB
  await mongoose.connect(`${MONGO_URL}`);
}

run()
  .then((result) =>
    app.listen(PORT, () => console.log(`app running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
