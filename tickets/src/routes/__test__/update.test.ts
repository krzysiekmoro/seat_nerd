import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns a 404 when updating non-existing ticket", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signup())
    .send({ title: "kgjktgklt", price: 23 })
    .expect(404);
});

it("return a 401 when user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "kgjktgklt", price: 23 })
    .expect(401);
});

it("return a 401 if user does not own ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", signup())
    .send({ title: "kgjktgklt", price: 23 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signup())
    .send({ title: "njkef", price: 54 })
    .expect(401);
});

it("return a 400 if user provided invalid inputs", async () => {
  const cookie = signup();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({ title: "kgjktgklt", price: 23 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 54 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "ggrgrg", price: -54 })
    .expect(400);
});

it("return a 201 if user provided valid inputs", async () => {
  const cookie = signup();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({ title: "kgjktgklt", price: 23 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "something", price: 54 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("something");
  expect(ticketResponse.body.price).toEqual(54);
});
