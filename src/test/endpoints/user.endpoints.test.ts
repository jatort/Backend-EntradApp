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
});
