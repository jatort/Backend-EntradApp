import request from "supertest";
import { app, stopDb } from "../../index";
import { User } from "../../schemas/User";
import { Event } from "../../schemas/Event";
import mongoose from "mongoose";
import { decodeBase64 } from "bcryptjs";

// Usuario generico de prueba para crear un evento
const userDataClient = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "client",
  password: "TekLoon123",
};

// Usuario de productora de prueba para crear un evento
const userDataProd = {
  username: "TekLoonProd",
  email: "tekloon.prod@gmail.com",
  role: "prod",
  password: "TekLoon123",
};

// Evento generico con usuario cliente para testear los endpoints
const eventData = {
  name: "Lollapalooza",
  category: "Music",
  date: new Date("2022-06-15"),
  dateLimitBuy: new Date("2022-06-09"),
  description:
    "Lollapalooza es un festival musical de los Estados Unidos que originalmente ofrecía bandas de rock alternativo, indie y punk rock; también hay actuaciones cómicas y de danza.",
  nTickets: 1000,
  imageUrl:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.adnradio.cl%2Fconciertos%2F2021%2F11%2F17%2Flollapalooza-chile-2022-que-lugares-podrian-sustituir-a-parque-ohiggins.html&psig=AOvVaw39bRWA_GrXo6ZWiJ9AOqnM&ust=1652595291018000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMi5pq2r3vcCFQAAAAAdAAAAABAD",
  price: 100,
};

const getToken = async (userData: Object) => {
  await request(app).post("/api/v1/user").send(userData);
  let resUser = await request(app).post("/api/v1/login").send(userData);
  let token = resUser.body["token"];
  return token;
};

beforeAll(async () => {
  await Event.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await stopDb();
});

describe("Event POST endpoints", () => {
  it("Testing event post endpoint with client user", async () => {
    let token = await getToken(userDataClient);
    const res = await request(app)
      .post("/api/v1/event")
      .set("Authorization", `Bearer ${token}`)
      .send(eventData);
    expect(res.statusCode).toEqual(401);
  });
  it("Testing event post without token with prod user", async () => {
    let token = await getToken(userDataProd);
    const res = await request(app)
      .post("/api/v1/event")
      .set("Authorization", `Bearer ${token}`)
      .send(eventData);
    expect(res.statusCode).toEqual(201);
  });
});

describe("Event GET endpoints", () => {
  it("Testing event get endpoint with future date", async () => {
    let token = await getToken(userDataClient);
    await request(app)
      .post("/api/v1/event")
      .set("Authorization", `Bearer ${token}`)
      .send(eventData);
    const res = await request(app).get("/api/v1/event");
    expect(res.body.events.length).toBe(1);
  });
  it("Testing event get endpoint with past date", async () => {
    let token = await getToken(userDataClient);
    await request(app)
      .post("/api/v1/event")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...eventData, date: new Date("2020-05-24") });
    const res = await request(app).get("/api/v1/event");
    expect(res.body.events[0].date).toBe("2022-06-15T00:00:00.000Z");
  });
});
