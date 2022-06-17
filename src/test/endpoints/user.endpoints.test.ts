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

const prodData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "prod",
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
  address: "Puchuncaví 3244",
  city: "Santiago",
};

beforeAll(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await stopDb();
});

afterEach(async () => {
  await User.deleteMany({});
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
  it("Testing user get", async () => {
    const resRegister = await request(app).post("/api/v1/user").send(prodData);
    const res = await request(app).get(`/api/v1/user/${resRegister.body._id}`);
    expect(res.statusCode).toEqual(200);
  });
  it("Testing user get not created", async () => {
    const resRegister = await request(app).post("/api/v1/user").send(prodData);
    const res = await request(app).post(
      `/api/v1/user/${resRegister.body._id}INVALID`
    );
    expect(res.statusCode).toEqual(404);
  });
});

describe("Login endpoints", () => {
  it("Testing user login", async () => {
    await request(app).post("/api/v1/user").send(userData);
    const res = await request(app).post("/api/v1/login").send(userData);
    expect(res.statusCode).toEqual(200);
  });
  it("Testing login with user not created", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send(invalidUserNoCreated);
    expect(res.body.error).toBe("User not found.");
    expect(res.statusCode).toEqual(400);
  });
  it("Testing login with user invalid password", async () => {
    await request(app).post("/api/v1/user").send(userData);
    const res = await request(app)
      .post("/api/v1/login")
      .send(userInvalidPassword);
    expect(res.body.error).toBe("Invalid password.");
    expect(res.statusCode).toEqual(400);
  });
});

describe("Event GET prod/myevents", () => {
  it("Testing get user id events endpoint with event created", async () => {
    const resRegister = await request(app).post("/api/v1/user").send(prodData);
    let resUser = await request(app).post("/api/v1/login").send(prodData);
    let token = resUser.body["token"];
    await request(app)
      .post("/api/v1/event")
      .set("Authorization", `Bearer ${token}`)
      .send(eventData);
    const res = await request(app)
      .get(`/api/v1/prod/myevents`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.events.length).toBe(1);
  });
  it("Testing get user id events endpoint with no event created", async () => {
    const resRegister = await request(app).post("/api/v1/user").send(prodData);
    let resUser = await request(app).post("/api/v1/login").send(prodData);
    let token = resUser.body["token"];

    const res = await request(app)
      .get(`/api/v1/prod/myevents`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No events found");
  });
  it("Testing get user id events endpoint with invalid token", async () => {
    const resRegister = await request(app).post("/api/v1/user").send(prodData);
    let token = "thisisainvalidtoken";
    const res = await request(app)
      .get(`/api/v1/prod/myevents`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });
});

describe("Event GET user/myProfile", () => {
  it("Testing get prod user profile", async () => {
    const resRegister = await request(app).post("/api/v1/user").send(prodData);
    let resUser = await request(app).post("/api/v1/login").send(prodData);
    let token = resUser.body["token"];
    const res = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  it("Testing get client user profile", async () => {
    const resRegister = await request(app).post("/api/v1/user").send(userData);
    let resUser = await request(app).post("/api/v1/login").send(userData);
    let token = resUser.body["token"];
    const res = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  it("Testing get client user profile", async () => {
    let token = "invalidToken";
    const res = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });
});
