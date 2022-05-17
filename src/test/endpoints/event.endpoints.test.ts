import request from "supertest";
import { app } from "../../index";
import { User } from "../../schemas/User";
import { Event } from "../../schemas/Event";
import mongoose from "mongoose";

// Usuario generico de prueba para crear un evento
const userData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "common",
  password: "TekLoon123",
};

const testUser = new User(userData);

// Evento generico para testear los endpoints
const eventData = {
  name: "Lollapalooza",
  category: "Music",
  date: new Date("2022-06-15"),
  dateLimitBuy: new Date("2022-06-09"),
  description:
    "Lollapalooza​ es un festival musical de los Estados Unidos que originalmente ofrecía bandas de rock alternativo, indie y punk rock; también hay actuaciones cómicas y de danza.",
  nTickets: 1000,
  imageUrl:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.adnradio.cl%2Fconciertos%2F2021%2F11%2F17%2Flollapalooza-chile-2022-que-lugares-podrian-sustituir-a-parque-ohiggins.html&psig=AOvVaw39bRWA_GrXo6ZWiJ9AOqnM&ust=1652595291018000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMi5pq2r3vcCFQAAAAAdAAAAABAD",
  userId: testUser._id,
};

beforeAll(async () => {
  await Event.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Event endpoints", () => {
  it("Testing event post endpoint", async () => {
    const res = await request(app).post("/api/v1/event").send(eventData);
    expect(res.statusCode).toEqual(201);
  });
});
