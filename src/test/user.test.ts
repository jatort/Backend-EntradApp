import mongoose from "mongoose";
import { User } from "../schemas/User";
const db = require("./setup/db");

const userData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "common",
  password: "TekLoon123",
};

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

/**
 * User model
 */
describe("User model", () => {
  it("create & save user successfully", async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(await savedUser.validatePassword(validUser.password)).toBe(true);
    expect(savedUser.role).toBe(userData.role);
  });

  /* it("create user with invalid email", async () => {
    const invalidUser = new User({ ...userData, email: "invalidEmail" });
    const validationResult: any = await invalidUser.save();
    expect(validationResult.errors.email.message).toBe("invalid email");
  }); */

  // It should us tell us the errors in on email field.
  it("create user without required field should failed", async () => {
    const userWithoutRequiredField = new User({ username: "TekLoon" });
    let err;
    try {
      const savedUserWithoutRequiredField =
        await userWithoutRequiredField.save();
    } catch (error: any) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});
