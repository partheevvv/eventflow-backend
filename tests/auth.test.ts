import app from "../src/app"
import request from "supertest"

describe("Auth API", () => {
    it("should register user", async () => {
        const email = `register_${Date.now()}@example.com`

        const res = await request(app)
        .post("/auth/register")
        .send({
          email,
          password: "Password123"
        })

        expect(res.status).toBe(200)
        expect(res.body.data.user).toHaveProperty("id")
        expect(res.body.data).toHaveProperty("token")
    })

    it("should login user", async () => {
        const email = `login_${Date.now()}@example.com`

        await request(app)
        .post("/auth/register")
        .send({
          email,
          password: "Password123"
        })

        const res = await request(app)
        .post("/auth/login")
        .send({
          email,
          password: "Password123"
        })

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty("token")
    })

    it("should fail for invalid email", async () => {
        const res = await request(app)
        .post("/auth/register")
        .send({
          email: "invalid-email",
          password: "123"
        })

        expect(res.status).toBe(400)
    })
})