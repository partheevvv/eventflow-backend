import request from "supertest"
import app from "../src/app"

jest.mock("../src/config/stripe", () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: "pi_test_123",
        client_secret: "cs_test_123"
      })
    }
  }
}))

let token: string
let ticketId: string
let orderId: string

describe("Order API", () => {
  const email = `test${Date.now()}@example.com`

  beforeAll(async () => {
    await request(app)
      .post("/auth/register")
      .send({
        email,
        password: "Password123"
      })

    const login = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "Password123"
      })

    token = login.body.data.token

    const event = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Event",
        description: "Valid event description",
        location: "Delhi",
        date: "2026-05-01",
        capacity: 100
      })

    const eventId = event.body.data.id

    const ticket = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        eventId,
        name: "General",
        price: 500,
        quantity: 5
      })

    ticketId = ticket.body.data.id
  })

  it("should create order", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ticketId,
        quantity: 2
      })

    expect(res.status).toBe(200)
    orderId = res.body.data.id
  })

  it("should create payment intent", async () => {
    const res = await request(app)
      .post(`/orders/${orderId}/pay`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("clientSecret")
  })
})