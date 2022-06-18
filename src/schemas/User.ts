import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcryptjs";
const { isEmail } = require("validator");

const SALT_WORK_FACTOR = 10;

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
  validatePassword: (data: string) => Promise<boolean>;
}
// Clase para manejar la creación de usuarios con tsoa
export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    createIndexes: { unique: true },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "invalid email"],
  },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: "active" },
});

// Referenciado de https://stackoverflow.com/questions/14588032/mongoose-password-hashing

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err: any) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(
  data: string
) {
  return await bcrypt.compare(data, this.password);
};

// Create model
export const User = model<IUser>("User", UserSchema); // User is the name of the collection
