import * as dotenv from "dotenv";

dotenv.config();

export default {
  apiURL: process.env.API_URL,
  baseURL: process.env.BASE_URL,
};
