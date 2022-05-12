import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { User } from "./schemas/User";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.get("/", (req: Request, res: Response) => {
  return res.json({
    status: "Hola!",
  });
});

async function run() {
  // Connect to MongoDB
  await mongoose.connect(`${MONGO_URL}`);
}

run()
  .then((result) =>
    app.listen(PORT, () => console.log(`app running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
