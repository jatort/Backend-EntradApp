import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { createUser } from "./controllers/userController";

dotenv.config();
const app = express();

app.use(express.json()); // for parsing application/json

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.get("/", (req: Request, res: Response) => {
  return res.json({
    status: "Hola!",
  });
});

app.post("/user", async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.status(200).json({ user });
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
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
