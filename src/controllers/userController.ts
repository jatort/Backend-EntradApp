import { User } from "../schemas/User";
import mongoose from "mongoose";

export async function createUser(data: Object) {
  const user = new User(data);
  try {
    await user.save();
    return user;
  } catch (err: any) {
    if (err.code === 11000) {
      throw new Error("User already exists");
    } else if (err == mongoose.Error.ValidationError) {
      throw new Error("Invalid user data");
    } else if (err.errors.email.message == "invalid email") {
      throw new Error("Invalid email");
    }
  }
}
