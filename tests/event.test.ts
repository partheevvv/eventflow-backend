import request from "supertest"
import app from "../src/app"

let token: string
let eventId: string
let ticketId: string

describe("Event + Ticket API", () => {
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
    })

    it("should create event", async () => {
        const res = await request(app)
        .post("/events")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Tech Conf",
            description: "Test event description",
            location: "Bangalore",
            date: "2026-05-01",
            capacity: 100
        })

        expect(res.status).toBe(200)
        eventId = res.body.data.id
    })

    it("should create ticket", async () => {
        const res = await request(app)
        .post("/tickets")
        .set("Authorization", `Bearer ${token}`)
        .send({
            eventId,
            name: "VIP",
            price: 1000,
            quantity: 10
        })

        expect(res.status).toBe(200)
        ticketId = res.body.data.id
        expect(ticketId).toBeTruthy()
    })
})