import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof@morawski.com",
      password: "password123",
    })
    .expect(201);
});

it("return a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof",
      password: "password123",
    })
    .expect(400);
});

it("return a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof@morawski.com",
      password: "pas",
    })
    .expect(400);
});

it("return a 400 if no data was sent", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof@morawski.com",
      password: "password123",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof@morawski.com",
      password: "password123",
    })
    .expect(400);
});

it("set a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof@morawski.com",
      password: "password123",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
