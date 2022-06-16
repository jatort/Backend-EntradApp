const db = require("../setup/db");
import { Ticket } from "../../schemas/Ticket";
import { User } from "../../schemas/User";
import { Event } from "../../schemas/Event";
import { Order } from "../../schemas/Order"

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

const ticketData = {
  price: 100,
  event: testEvent._id,
  user: testUser._id,
  purchaseDate: "2022-06-15",
};

const validTicket = new Ticket(ticketData);

const orderData = {
  user: testUser._id,
  event: testEvent._id,
  nTickets: 4,
  amount: validTicket.price * 4,
  currency: "CLP",
  isPending: true
};

describe("Order model", () => {
  afterEach(async () => {
    await db.dropCollections();
  });

  it("create & save order succesfully", async () => {
    const order = new Order(orderData);
    const savedOrder = await order.save();
    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.user).toBe(order.user);
    expect(savedOrder.event).toBe(order.event);
    expect(savedOrder.nTickets).toBe(order.nTickets);
    expect(savedOrder.amount).toBe(order.amount);
    expect(savedOrder.currency).toBe(order.currency);
    expect(savedOrder.isPending).toBe(order.isPending);
  });
});
