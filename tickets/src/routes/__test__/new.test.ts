import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("returns 401 if user is NOT logged in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns anything else but 401 if user is logged in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({});
  expect(response.status).not.toEqual(404);
});

it("returns an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "",
      price: "10",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      price: "10",
    })
    .expect(400);
});

it("returns an error if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Koncert",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Mundial",
      price: -10,
    })
    .expect(400);
});

it("creates ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({ title: "World Cup 2022", price: 500 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("World Cup 2022");
  expect(tickets[0].price).toEqual(500);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({ title: "World Cup 2022", price: 500 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
