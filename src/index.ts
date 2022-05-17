import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import routes from "./routes/index"

dotenv.config();
export const app = express();

app.use(express.json()); // for parsing application/json

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.use("/api/v1/", routes)

async function run() {
  // Connect to MongoDB
  await mongoose.connect(`${MONGO_URL}`);
}

run()
  .then((result) =>
    {
      if(process.env.NODE_ENV !== "test") app.listen(PORT, () => console.log(`app running on port ${PORT}`));
    }
  )
  .catch((err) => console.log(err));
