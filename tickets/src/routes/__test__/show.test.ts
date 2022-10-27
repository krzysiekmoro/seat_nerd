import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns a 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it("return a ticket if ticket is found", async () => {
  const title = "title";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({ title, price })
    .expect(201);

  const ticketReponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketReponse.body.title).toEqual(title);
  expect(ticketReponse.body.price).toEqual(price);
});
