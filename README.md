# NestJS Microservices E-Commerce Platform

A production-grade backend system built with **NestJS microservices architecture**, featuring async and RPC-based inter-service communication over **RabbitMQ**, secure authentication via **Clerk JWT**, product search powered by **Elasticsearch**, and media handling via **Cloudinary**.

---

## 🏗️ Architecture Overview

This project follows a modular microservices design with a central API Gateway handling authentication and routing, and independent services communicating asynchronously and via RPC through RabbitMQ.

```
                        ┌─────────────┐
                        │   Client    │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ API Gateway │  ── Clerk JWT Auth (Guards)
                        └──────┬──────┘
                               │ RabbitMQ (RPC)
              ┌────────────────┼────────────────┐
              │                │                 │
       ┌──────▼─────┐   ┌──────▼──────┐   ┌──────▼──────┐
       │  Catalog   │   │   Search    │   │    Media    │
       │  Service   │   │   Service   │   │   Service   │
       │ (MongoDB)  │   │(Elasticsearch)│  │ (Cloudinary)│
       └──────┬─────┘   └──────▲──────┘   └─────────────┘
              │                │
              └── events (pub/sub) ──┘
```

---

## ⚙️ What's Inside

| Component | Responsibility |
|---|---|
| 🚪 **API Gateway** | Central entry point, Clerk JWT verification, request routing |
| 📦 **Catalog Service** | Product CRUD operations backed by MongoDB |
| 🔍 **Search Service** | Elasticsearch indexing, kept in sync via events |
| 🖼️ **Media Service** | Handles file uploads and stores images via Cloudinary |
| 🗄️ **Message Broker** | RabbitMQ for both async events and RPC request-response |
| 🔐 **Auth Layer** | Clerk JWT validation using custom guards & decorators |
| 📜 **Validation & Errors** | DTO-based validation with centralized `RpcException` mapping |
| 🚦 **Reliability** | Health checks, structured logging across services |


---

## 🔄 Request Flow

1. Client sends a request to the **API Gateway**.
2. Gateway verifies the **Clerk JWT** using a custom guard before allowing the request through.
3. Verified requests are forwarded to the relevant microservice over **RabbitMQ using the RPC pattern** (request-response).
4. **Catalog Service** performs CRUD operations on MongoDB and emits domain events (e.g. `product.created`, `product.updated`).
5. **Search Service** listens to these events asynchronously and keeps its **Elasticsearch** index in sync.
6. **Media Service** independently handles file uploads, storing images on **Cloudinary** and returning URLs to be linked with product records.
7. Any failure in a microservice is thrown as an `RpcException`, caught by a **global exception filter** at the Gateway, and returned to the client in a consistent error format.

---

## 🛠️ Tech Stack

- **Framework:** NestJS (monorepo, microservices)
- **Message Broker:** RabbitMQ (async events + RPC)
- **Database:** MongoDB
- **Search Engine:** Elasticsearch
- **Media Storage:** Cloudinary
- **Auth:** Clerk (JWT)
- **Containerization:** Docker

---

## 📂 Project Structure

```
apps/
  ├── gateway/          # API Gateway – auth, routing
  ├── catalog/          # Product CRUD service
  ├── search/           # Elasticsearch sync service
  └── media/            # Cloudinary upload service
libs/
  ├── common/           # Shared DTOs, filters, decorators
  └── rmq/              # RabbitMQ client/module setup
docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Clerk account (for JWT auth)
- Cloudinary account
- RabbitMQ & Elasticsearch (via Docker)

### Setup

```bash
# Clone the repo
git clone https://github.com/ali-sorathiya64/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install

# Start infra (RabbitMQ, MongoDB, Elasticsearch)
docker-compose up -d

# Configure environment variables
cp .env.example .env

# Run each service
npm run start:dev gateway
npm run start:dev catalog
npm run start:dev search
npm run start:dev media
```

### Environment Variables

Each service requires its own `.env` — key variables include:

```
MONGO_URI=
RABBITMQ_URI=
CLERK_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ELASTICSEARCH_NODE=
```

---

## 🚦 Health Checks

Each microservice exposes a health endpoint for monitoring uptime and readiness.

---

## 📌 Notes

This project was built as a hands-on exploration of production-grade NestJS microservices patterns — inter-service communication (async events + RPC), centralized auth, and distributed error handling.

---


