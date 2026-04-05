# 🚀 EventFlow Backend

A **production-ready event management backend** built with modern backend technologies, featuring secure authentication, payment integration, caching, background jobs, and CI/CD.

---

## 🧠 Overview

EventFlow Backend is a scalable system that allows users to:

* Create and manage events
* Add and manage tickets
* Place orders with stock validation
* Pay securely using Stripe
* Process asynchronous tasks using queues
* Improve performance with Redis caching

---

## 🎯 Features

* 🔐 JWT-based Authentication (Register/Login)
* 🎉 Event Creation & Management
* 🎟️ Ticket Management per Event
* 🛒 Order System with inventory validation
* 💳 Stripe Payment Integration (Payment Intents + Webhooks)
* 📦 Inventory update after successful payment
* ⚡ Redis Caching for performance optimization
* 🔁 Background Jobs using BullMQ
* 🧪 Integration Testing (Jest + Supertest)
* 🐳 Dockerized Application
* 🔄 CI/CD with GitHub Actions

---

## 🏗️ Architecture

```
Client
 ↓
Express API (Node.js)
 ↓
Service Layer
 ↓
Repository Layer (Prisma ORM)
 ↓
PostgreSQL Database

+ Redis (Caching + Queue backend)
+ BullMQ (Background jobs)
+ Stripe (Payments + Webhooks)
```

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Caching & Queue

* Redis
* BullMQ

### Payments

* Stripe (Payment Intents + Webhooks)

### Validation & Auth

* Zod
* JWT

### Testing

* Jest
* Supertest

### DevOps

* Docker
* Docker Compose
* GitHub Actions (CI/CD)

---

## 🔐 Authentication

* Users register and login using email/password
* JWT token is returned on login
* Protected routes require:

```
Authorization: Bearer <token>
```

---

## 💳 Payment Flow

```
1. User creates order → status = PENDING
2. Backend creates Stripe PaymentIntent
3. User completes payment
4. Stripe sends webhook (payment_intent.succeeded)
5. Webhook:
   ✔ Verifies order
   ✔ Reduces ticket stock
   ✔ Updates order → PAID
   ✔ Triggers background job
```

---

## 🧠 Key Concepts Implemented

* Idempotent webhook handling
* Database transactions (Prisma)
* Inventory consistency
* Redis caching strategy
* Background job processing (BullMQ)
* Clean architecture (controller/service/repository)
* Environment-based configuration

---

## 📁 Project Structure

```
src/
 ├── config/        # DB, Redis, Stripe, env
 ├── modules/
 │    ├── auth/
 │    ├── event/
 │    ├── ticket/
 │    ├── order/
 ├── utils/         # ApiError, response helpers
 ├── middleware/    # auth, logging
 ├── server.ts

prisma/
 ├── schema.prisma

tests/
 ├── auth.test.ts
 ├── event.test.ts
 ├── order.test.ts
 ├── setup.ts

.github/
 ├── workflows/
 │    └── ci.yml

Dockerfile
docker-compose.yml
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 🧪 Testing

* Integration tests using Jest + Supertest
* Covers:

  * Authentication
  * Event & ticket creation
  * Order flow
  * Payment intent
* Database cleaned between tests

Run tests:

```bash
npm test
```

---

## ⚡ Caching Strategy

* Redis caches event listings
* Cache key includes pagination + filters
* Cache invalidation on:

  * Event creation
  * Event update
  * Event deletion

---

## 🔁 Queue System

* BullMQ for background processing
* Example:

  * Order paid → queue job triggered
* Worker handles async tasks (e.g., notifications)

---

## 🐳 Docker Setup

Run full system using Docker:

```bash
docker compose up --build
```

Services:

* Backend API
* PostgreSQL
* Redis

---

## 🔄 CI/CD Pipeline

* GitHub Actions workflow
* Runs on every push
* Steps:

  * Install dependencies
  * Generate Prisma client
  * Run migrations
  * Run tests

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Run with Docker

```bash
docker compose up --build
```

---

## 🔮 Future Improvements

* Frontend integration (React / Next.js)
* Rate limiting & security enhancements
* API documentation (Swagger)
* Email notifications
* Order expiry system
* Role-based access control
* Monitoring (Prometheus + Grafana)

---

## 🏆 Resume Value

This project demonstrates:

* Backend architecture design
* Payment gateway integration
* Real-time systems (queue + cache)
* DevOps (Docker + CI/CD)
* Testing practices
* Production-ready coding standards

---

## 📌 Summary

> A scalable, production-ready event management backend with payments, caching, background jobs, and CI/CD pipeline.