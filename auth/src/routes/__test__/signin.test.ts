import request from "supertest";
import { app } from "../../app";

it("returns a 400 when unknown email is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "krzys@morawski.com",
      password: "password123",
    })
    .expect(400);
});

it("returns a 400 when wrong password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof@morawski.com",
      password: "password123",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "krzysztof@morawski.com",
      password: "1234password",
    })
    .expect(400);
});

it("returns a cookie after successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "krzysztof@morawski.com",
      password: "password123",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "krzysztof@morawski.com",
      password: "password123",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
