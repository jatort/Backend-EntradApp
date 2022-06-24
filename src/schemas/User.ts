import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcryptjs";
import CryptoJS, { AES } from "crypto-js";
import * as dotenv from "dotenv";

dotenv.config();

const SALT_WORK_FACTOR = 10;
const AESkey = process.env.AES_KEY;
const regex =
  "[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com|hotmail.com|yahoo.com)";
const patt = new RegExp(regex);

if (AESkey == undefined) {
  throw new Error("AES key not defined");
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
  apiKey: string;
  secretKey: string;
  decodeApiKey: () => string;
  decodeSecretKey: () => string;
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
    validate: {
      validator: function (v: string) {
        return patt.test(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
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
    this.apiKey = CryptoJS.AES.encrypt(this.apiKey, AESkey).toString();
    this.secretKey = CryptoJS.AES.encrypt(this.secretKey, AESkey).toString();
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

UserSchema.methods.decodeApiKey = function decodeApiKey(): string {
  return CryptoJS.AES.decrypt(this.apiKey, AESkey).toString(CryptoJS.enc.Utf8);
};

UserSchema.methods.decodeSecretKey = function decodeApiKey(): string {
  return CryptoJS.AES.decrypt(this.secretKey, AESkey).toString(
    CryptoJS.enc.Utf8
  );
};

// Create model
export const User = model<IUser>("User", UserSchema); // User is the name of the collection
