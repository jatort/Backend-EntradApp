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
  apiKey: string;
  secretKey: string;
  validateApiKey: (data: string) => Promise<boolean>;
  validateSecretKey: (data: string) => Promise<boolean>;
  validatePassword: (data: string) => Promise<boolean>;
}
// Clase para manejar la creación de usuarios con tsoa
export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  apiKey: string;
  secretKey: string;
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
  apiKey: { type: String, required: false, default: "" },
  secretKey: { type: String, required: false, default: "" },
});

// Referenciado de https://stackoverflow.com/questions/14588032/mongoose-password-hashing

UserSchema.pre("save", async function save(next) {
  if (
    !this.isModified("password") &&
    !this.isModified("apiKey") &&
    !this.isModified("secretKey")
  )
    return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    this.apiKey = await bcrypt.hash(this.apiKey, salt);
    this.secretKey = await bcrypt.hash(this.secretKey, salt);
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

UserSchema.methods.validateApiKey = async function validateApiKey(
  data: string
) {
  return await bcrypt.compare(data, this.apiKey);
};
UserSchema.methods.validateSecretKey = async function validateSecretKey(
  data: string
) {
  return await bcrypt.compare(data, this.secretKey);
};

// Create model
export const User = model<IUser>("User", UserSchema); // User is the name of the collection
