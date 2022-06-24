import mongoose from "mongoose";
import { IUser } from "../schemas/User";
const FlowApi = require("flowcl-node-api-client");
import config from "../routes/config";

export default class FlowController {
  async createMerchant(data: IUser & { _id: mongoose.Types.ObjectId }) {
    const flowApi = new FlowApi({
      ...config,
      apiKey: data.apiKey,
      secretKey: data.secretKey,
    });
    const body = {
      id: data._id,
      name: data.username,
      url: "https://entradapp-backend.herokuapp.com/",
    };
    try {
      const res = await flowApi.send("merchant/create", body, "POST");
      console.log(res);
      return;
    } catch (err: any) {
      console.log("DEBUG 1: ", err);
      throw new Error("Flow: " + err);
    }
  }
}
