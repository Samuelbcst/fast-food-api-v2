# API Scaffold – Tech Challenge Fase 01

## 📋 Project Overview

This project is a backend system for a fast-food self-service kiosk, designed to streamline order management, product administration, and customer identification for a growing neighborhood snack bar. The system is built using a hexagonal architecture (ports & adapters), TypeScript, Express, TypeORM, and PostgreSQL, and is fully containerized with Docker.

---

## 🚀 Features

- **Order Management**: Place, track, and update orders with status progression.
- **Product & Category Management**: CRUD operations for products and fixed categories (Lanche, Acompanhamento, Bebida, Sobremesa).
- **Customer Management**: Register and identify customers via CPF.
- **Fake Checkout**: Simulate payment and order queueing.
- **Admin Panel (API)**: Endpoints for managing products, customers, and monitoring orders.
- **API Documentation**: Swagger UI available for all endpoints.
- **Dockerized**: Easy setup with Docker Compose for both app and database.

---

## 🏗️ Architecture

- **Hexagonal (Ports & Adapters)**
- **Domain-Driven Design (DDD)**
- **TypeORM for persistence**
- **Express for HTTP API**

---

## 📝 Event Storming & DDD

- [ ] Add Event Storming diagrams for:
    - Order and payment flow
    - Preparation and delivery flow

---

## 🧑‍💻 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (for local development)

### Running with Docker Compose

```bash
yarn compose
```

- The API will be available at `http://localhost:3000`
- Swagger UI: `http://localhost:3000/swagger`

### Environment Variables

Copy `.env.sample` to `.env` and adjust as needed.

---

## 🧪 Running Tests

```bash
yarn test
```

---

## 🗂️ Endpoints Checklist

### Customer

- [ ] `POST /customers` – Register customer
- [ ] `GET /customers/:cpf` – Identify customer by CPF
- [ ] `GET /customers` – List all customers (admin)
- [ ] `PUT /customers/:id` – Update customer (optional)
- [ ] `DELETE /customers/:id` – Delete customer (optional)

### Product & Category

- [ ] `POST /products` – Create product
- [ ] `PUT /products/:id` – Edit product
- [ ] `DELETE /products/:id` – Remove product
- [ ] `GET /products` – List all products
- [ ] `GET /products/category/:category` – List products by category
- [ ] `GET /categories` – List all categories

### Order

- [ ] `POST /orders` – Create order (checkout/fake payment)
- [ ] `GET /orders` – List all orders (admin)
- [ ] `GET /orders/:id` – Get order by ID
- [ ] `PUT /orders/:id/status` – Update order status (kitchen/admin)
- [ ] `GET /orders/customer/:customerId` – List orders for a customer

### Order Tracking

- [ ] `GET /orders/:id/status` – Get order status (for customer display)

### Payment (Fake/MVP)

- [ ] `POST /payments` – Simulate payment (if separated)

### Swagger

- [ ] `GET /api-docs` – API documentation

---

## 🛠️ Database

- PostgreSQL (via Docker)
- TypeORM migrations auto-run on container start

---

## 🛡️ Security & Best Practices

- Environment variables managed via `.env`
- Sensitive files ignored via `.gitignore`
- No secrets committed to the repository

---

## 📹 Demo Video

- [ ] Add a link to your demonstration video here before submission.

---

## 📚 How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📄 License

MIT
