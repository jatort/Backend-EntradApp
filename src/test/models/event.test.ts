import mongoose from "mongoose";
import { IEvent, Event } from "../../schemas/Event";
import { IUser, User } from "../../schemas/User";
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
  date: new Date("2022-06-15"),
  dateLimitBuy: new Date("2022-06-09"),
  description:
    "Lollapalooza​ es un festival musical de los Estados Unidos que originalmente ofrecía bandas de rock alternativo, indie y punk rock; también hay actuaciones cómicas y de danza.",
  nTickets: 1000,
  imageUrl:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.adnradio.cl%2Fconciertos%2F2021%2F11%2F17%2Flollapalooza-chile-2022-que-lugares-podrian-sustituir-a-parque-ohiggins.html&psig=AOvVaw39bRWA_GrXo6ZWiJ9AOqnM&ust=1652595291018000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMi5pq2r3vcCFQAAAAAdAAAAABAD",
  user: testUser._id,
};

const eventWithoutDescription = {
  name: "Lollapalooza",
  category: "Music",
  date: new Date("2022-06-15"),
  dateLimitBuy: new Date("2022-06-09"),
  nTickets: 1000,
  user: testUser._id,
};

const eventInvalid = {
  name: "Lollapalooza",
  category: "Music",
  date: new Date("2022-06-03"),
  dateLimitBuy: new Date("2022-06-09"),
  nTickets: 1000,
  user: testUser._id,
};

describe("Event model", () => {
  afterEach(async () => {
    await db.dropCollections();
  });
  
  it("create & save event successfully", async () => {
    const validEvent = new Event(eventData);
    const savedEvent = await validEvent.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.name).toBe(validEvent.name);
    expect(savedEvent.category).toBe(validEvent.category);
    expect(savedEvent.date).toBe(validEvent.date);
    expect(savedEvent.dateLimitBuy).toBe(validEvent.dateLimitBuy);
    expect(savedEvent.description).toBe(validEvent.description);
    expect(savedEvent.nTickets).toBe(validEvent.nTickets);
    expect(savedEvent.imageUrl).toBe(validEvent.imageUrl);
    expect(savedEvent.user).toBe(validEvent.user);
  });

  it("create & save event without description & image successfully", async () => {
    const validEvent = new Event(eventWithoutDescription);
    const savedEvent = await validEvent.save();
    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.name).toBe(validEvent.name);
    expect(savedEvent.category).toBe(validEvent.category);
    expect(savedEvent.date).toBe(validEvent.date);
    expect(savedEvent.dateLimitBuy).toBe(validEvent.dateLimitBuy);
    expect(savedEvent.nTickets).toBe(validEvent.nTickets);
    expect(savedEvent.user).toBe(validEvent.user);
    expect(savedEvent.description).toBeUndefined();
    expect(savedEvent.imageUrl).toBeUndefined();
  });

  it("create event with 'date' less than 'dateLimitBuy'", async () => {
    const invalidEvent = new Event(eventInvalid);
    try {
      const savedEvent = await invalidEvent.save();
    } catch (err: any) {
      expect(err.message).toBe("'date' must be more than 'dateLimitBuy'");
    }
  });
});
