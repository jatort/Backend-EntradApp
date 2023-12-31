import mongoose from "mongoose";
import { ITicket, Ticket } from "../../schemas/Ticket";
import { IUser, User } from "../../schemas/User";
import { IEvent, Event } from "../../schemas/Event";
import { Order } from "../../schemas/Order";
const db = require("../setup/db");

beforeAll(async () => {
  await db.setUp();
});

afterAll(async () => {
  await db.dropDatabase();
});

const userData = {
  username: "TekLoon",
  email: "tekloon@gmail.com",
  role: "common",
  password: "TekLoon123",
};

const testUser = new User(userData);

const eventData = {
  name: "Lollapalooza",
  category: "Music",
  date: new Date("2022-08-15"),
  dateLimitBuy: new Date("2022-08-09"),
  description:
    "Lollapalooza​ es un festival musical de los Estados Unidos que originalmente ofrecía bandas de rock alternativo, indie y punk rock; también hay actuaciones cómicas y de danza.",
  nTickets: 5,
  price: 100,
  imageUrl:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.adnradio.cl%2Fconciertos%2F2021%2F11%2F17%2Flollapalooza-chile-2022-que-lugares-podrian-sustituir-a-parque-ohiggins.html&psig=AOvVaw39bRWA_GrXo6ZWiJ9AOqnM&ust=1652595291018000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMi5pq2r3vcCFQAAAAAdAAAAABAD",
  user: testUser._id,
};

const testEvent = new Event(eventData);

const orderData = {
  user: testUser._id,
  event: testEvent._id,
  nTickets: 4,
  amount: testEvent.price * 4,
  currency: "CLP",
  isPending: true,
  commerceOrder:  Math.floor(Math.random() * (2000 - 1100 + 1)) + 1100,
};

const testOrder = new Order(orderData);

const ticketData = {
  price: 100,
  event: testEvent._id,
  user: testUser._id,
  order: testOrder._id,
  purchaseDate: "2022-06-15",
  date: new Date("2022-06-15"),
};

describe("Ticket model", () => {
  afterEach(async () => {
    await db.dropCollections();
  });

  it("create & save ticket succesfully", async () => {
    const validTicket = new Ticket(ticketData);
    const savedTicket = await validTicket.save();
    expect(savedTicket._id).toBeDefined();
    expect(savedTicket.price).toBe(validTicket.price);
    expect(savedTicket.event).toBe(validTicket.event);
    expect(savedTicket.user).toBe(validTicket.user);
    expect(savedTicket.purchaseDate).toBe(validTicket.purchaseDate);
  });
});
