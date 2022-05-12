import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { createUser } from "./controllers/userController";

dotenv.config();
export const app = express();

app.use(express.json()); // for parsing application/json

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.get("/", (req: Request, res: Response) => {
  return res.json({
    status: "Hola!",
  });
});
/*
  USUARIOS
*/
app.post("/user", async (req: Request, res: Response) => {
  /*
  Endpoint para crear usuarios, en caso de exito retorna los datos del nuevo modelo usuario, en caso contrario se retorna el código 400
  con el mensaje específico de la causa del error.
  */
  try {
    const user = await createUser(req.body);
    return res.status(201).json({ user });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});
/*
  FIN USUARIOS
*/

async function run() {
  // Connect to MongoDB
  await mongoose.connect(`${MONGO_URL}`);
}

run()
  .then((result) =>
    app.listen(PORT, () => console.log(`app running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
