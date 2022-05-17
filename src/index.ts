import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import morgan from "morgan";
import routes from "./routes/index";
import swaggerUi from "swagger-ui-express";

dotenv.config();
export const app = express();

app.use(express.json()); // for parsing application/json
app.use(morgan("tiny")); // routes log
app.use(express.static("public")); // static files

const { MongoMemoryServer } = require("mongodb-memory-server");
let mongo: any = undefined; 
const PORT = process.env.PORT;

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
  mongo = await MongoMemoryServer.create();
  const url = await mongo.getUri();
  const MONGO_URL = process.env.NODE_ENV == "test" ? url : process.env.MONGO_URL;
  await mongoose.connect(`${MONGO_URL}`);
}
export const dropCollections = async () => {
    if (mongo) {
      const collections = mongoose.connection.collections;

      for (const key in collections) {
	const collection = collections[key];
	await collection.deleteMany({});
      }
    }
}

export const stopDb = async () => {
  if (mongo) {
    console.log("Hay mongo");
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongo.stop();
    console.log("FINAL");//process.exit(0);
  }
  else { console.log("No hay mongo"); }
}

run()
  .then((result) => {
    if(process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => console.log(`app running on port ${PORT}`));
      console.log("NO testing");
    } else {
      console.log("TESTING!");
    }
  })
  .catch((err) => console.log(err));
  
