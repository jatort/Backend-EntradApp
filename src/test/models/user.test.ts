import mongoose from "mongoose";
import { IUser, User } from "../../schemas/User";
const db = require("../setup/db");

const userData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "common",
  password: "TekLoon123",
  apiKey: "someApiKey",
  secretKey: "someSecretKey",
};

beforeAll(async () => {
  await db.setUp();
});

afterAll(async () => {
  await db.dropDatabase();
});

/**
 * User model
 */
describe("User model", () => {
  afterEach(async () => {
    await db.dropCollections();
  });

  it("create & save user successfully", async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(await savedUser.validatePassword(userData.password)).toBe(true);
    expect(savedUser.decodeApiKey()).toBe(userData.apiKey);
    expect(savedUser.decodeSecretKey()).toBe(userData.secretKey);
    expect(await savedUser.status).toBe("active");
    expect(savedUser.role).toBe(userData.role);
  });

  it("create user with invalid email", async () => {
    const invalidMail = "invalidMail";
    const invalidUser = new User({ ...userData, email: invalidMail });
    // const validationResult: any = await invalidUser.validateSync();
    try {
      const invalidSave = await invalidUser.save();
    } catch (err: any) {
      expect(err.errors.email.message).toBe(
        `${invalidMail} is not a valid email`
      );
    }
  });

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

  it("create two users with the unique attribute should failed (using username)", async () => {
    const user1 = new User(userData);
    const user2 = new User(userData);
    await user1.save();
    try {
      await user2.save();
    } catch (err: any) {
      expect(err.code).toBe(11000);
    }
  });
});
