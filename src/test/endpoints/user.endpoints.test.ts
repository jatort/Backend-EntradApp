import request from "supertest";
import { app, dropCollections ,stopDb } from "../../index";
import { User } from "../../schemas/User";
//import mongoose from "mongoose";
// Usuario generico de prueba para crear un evento
//
//const db = require("../setup/db");

const userData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "common",
  password: "TekLoon123",
};

beforeAll(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await stopDb();
});

afterEach(async () => {
  await dropCollections();
});

describe("User endpoints", () => {
  it("Testing user post", async () => {
    jest.setTimeout(10000);
    const res = await request(app).post("/api/v1/user").send(userData);
    expect(res.statusCode).toEqual(201);
  });
});
