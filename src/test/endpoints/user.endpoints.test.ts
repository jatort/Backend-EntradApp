import request from "supertest";
import { app, stopDb } from "../../index";
import { User } from "../../schemas/User";
import { Event } from "../../schemas/Event";
import mongoose from "mongoose";
import { Ticket } from "../../schemas/Ticket";
import { getToken } from "./event.endpoints.test";
import { Order } from "../../schemas/Order";
// Usuario generico de prueba para crear un evento

const userData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "client",
  password: "TekLoon123",
  status: "active",
};

const prodData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "prod",
  password: "TekLoon123",
  status: "active",
};

const userInvalidData = {
  username: "TekLoon",
  email: "tekloongmailcom",
  role: "client",
  password: "TekLooninvalid",
};

const userInvalidEmail = {
  username: "TekLoon",
  email: "tekloongmailcom",
  role: "client",
  password: "TekLooninvalid",
};

const userInvalidPassword = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "client",
  password: "TekLooninvalid",
};

const invalidUserNoCreated = {
  username: "TekLoonNotCreated",
  email: "tekloonnotcreated@gmail.com",
  role: "client",
  password: "TekLoon123",
};

// Evento generico con usuario cliente para testear los endpoints
const eventData = {
  name: "Lollapalooza",
  category: "Music",
  date: new Date("2023-06-20"),
  dateLimitBuy: new Date("2023-06-10"),
  description:
    "Lollapalooza es un festival musical de los Estados Unidos que originalmente ofrecía bandas de rock alternativo, indie y punk rock; también hay actuaciones cómicas y de danza.",
  nTickets: 10,
  imageUrl:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.adnradio.cl%2Fconciertos%2F2021%2F11%2F17%2Flollapalooza-chile-2022-que-lugares-podrian-sustituir-a-parque-ohiggins.html&psig=AOvVaw39bRWA_GrXo6ZWiJ9AOqnM&ust=1652595291018000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMi5pq2r3vcCFQAAAAAdAAAAABAD",
  price: 35600,
  address: "Puchuncaví 3244",
  city: "Santiago",
};

const ticketData = {
  price: 100,
  purchaseDate: "2023-06-15",
};

const orderData = {
  nTickets: 4,
  amount: eventData.price * 4,
  currency: "CLP",
  isPending: true,
  commerceOrder:  Math.floor(Math.random() * (2000 - 1100 + 1)) + 1100,
};

beforeAll(async () => {
  await Event.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  // await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await stopDb();
});

afterEach(async () => {
  await Event.deleteMany({});
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

describe("Delete user test", () => {
  it("deleting client user with current tickets should fail", async () => {
    const r1 = await request(app).post("/api/v1/user").send(userData);
    const user = r1.body;
    const userToken = await getToken(userData);
    const myEvent = new Event({ ...eventData, user: user._id });
    await myEvent.save();
    const myOrder = new Order({
      ...orderData,
      user: user._id,
      event: myEvent._id,
    });
    await myOrder.save();
    const myTicket = new Ticket({
      ...ticketData,
      user: user._id,
      event: myEvent._id,
      order: myOrder._id,
      date: myEvent.date,
    });
    await myTicket.save();
    const res = await request(app)
      .delete("/api/v1/user")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User has active tickets");
  });
  it("deleting client user with no current tickets should succeed", async () => {
    const r1 = await request(app).post("/api/v1/user").send(userData);
    const user = r1.body;
    const userToken = await getToken(userData);
    const res = await request(app)
      .delete("/api/v1/user")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(202);
    expect(res.body.message).toBe("User deleted");
    const userDeleted = await User.findOne({ email: user.email });
    expect(userDeleted).toBeDefined();
    expect(userDeleted?.status).toBe("deleted");
  });
  it("deleting admin user with no current events should succeed", async () => {
    const r2 = await request(app).post("/api/v1/user").send(prodData);
    const prod = r2.body;
    const prodToken = await getToken(prodData);
    const myEvent = await request(app)
      .post("/api/v1/event")
      .set("Authorization", `Bearer ${prodToken}`)
      .send({
        ...eventData,
        user: prod._id,
        date: new Date("2022-01-20"),
        dateLimitBuy: new Date("2022-01-15"),
      });
    const res = await request(app)
      .delete("/api/v1/user")
      .set("Authorization", `Bearer ${prodToken}`);
    expect(res.statusCode).toBe(202);
    expect(res.body.message).toBe("User deleted");
    const userDeleted = await User.findOne({ email: prod.email });
    expect(userDeleted).toBeNull();
  });
  it("deleting admin user with current events should fail", async () => {
    const r2 = await request(app).post("/api/v1/user").send(prodData);
    const prod = r2.body;
    const prodToken = await getToken(prodData);
    const myEvent = await request(app)
      .post("/api/v1/event")
      .set("Authorization", `Bearer ${prodToken}`)
      .send({
        ...eventData,
        user: prod._id,
        date: new Date("2023-06-20"),
        dateLimitBuy: new Date("2023-06-15"),
      });
    const res = await request(app)
      .delete("/api/v1/user")
      .set("Authorization", `Bearer ${prodToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User has active events");
    const userDeleted = await User.findOne({ email: prod.email });
    expect(userDeleted).toBeDefined();
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
