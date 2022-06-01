import request from "supertest";
import { app, stopDb } from "../../index";
import { User } from "../../schemas/User";
import mongoose from "mongoose";
// Usuario generico de prueba para crear un evento

const userData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "common",
  password: "TekLoon123",
};

const userInvalidData = {
  username: "TekLoon",
  email: "tekloongmailcom",
  role: "common",
  password: "TekLooninvalid",
};

const userInvalidEmail = {
  username: "TekLoon",
  email: "tekloongmailcom",
  role: "common",
  password: "TekLooninvalid",
};

const userInvalidPassword = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "common",
  password: "TekLooninvalid",
};

const invalidUserNoCreated = {
  username: "TekLoonNotCreated",
  email: "tekloonnotcreated@gmail.com",
  role: "common",
  password: "TekLoon123",
};

beforeAll(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await stopDb(); 
});

describe("User endpoints", () => {
  it("Testing user post", async () => {
    const res = await request(app).post("/api/v1/user").send(userData);
    expect(res.statusCode).toEqual(201);
  });
  it("Testing user post invalid email", async () => {
    const res = await request(app).post("/api/v1/user").send(userInvalidEmail);
    expect(res.statusCode).toEqual(400);
  });
  it("Testing user post invalid email", async () => {
    const res = await request(app).post("/api/v1/user").send(userInvalidData);
    expect(res.statusCode).toEqual(400);
  });
});

describe("Login endpoints", () => {
  it("Testing user login", async () => {
    const res = await request(app).post("/api/v1/login").send(userData);
    expect(res.statusCode).toEqual(200);
  });
  it("Testing login with user not created", async () => {
    const res = await request(app).post("/api/v1/login").send(invalidUserNoCreated);
    expect(res.body.error).toBe('User not found.')
    expect(res.statusCode).toEqual(400);
  });
  it("Testing login with user invalid password", async () => {
    const res = await request(app).post("/api/v1/login").send(userInvalidPassword);
    expect(res.body.error).toBe('Invalid password.')
    expect(res.statusCode).toEqual(400);
  });
});
