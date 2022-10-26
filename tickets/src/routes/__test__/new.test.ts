import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("returns 401 if user is NOT logged in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns anything else but 401 if user is logged in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("returns an error if invalid title is provided", async () => {});

it("returns an error if invalid price is provided", async () => {});

it("creates ticket with valid inputs", async () => {});
