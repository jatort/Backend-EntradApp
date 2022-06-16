import * as dotenv from "dotenv";

dotenv.config();

export = {
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
  apiURL: process.env.API_URL,
  baseURL: process.env.BASE_URL
};

