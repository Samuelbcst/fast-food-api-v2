# Day 13: Documentation & Architecture Diagram

## Learning Objectives
- ✅ Create comprehensive architecture diagram
- ✅ Write complete README documentation
- ✅ Document API endpoints
- ✅ Create deployment guide
- ✅ Prepare for Tech Challenge submission

---

## Full Day Session (6-8 hours)

### Part 1: Architecture Diagram (2-3 hours)

#### What to Include

**Complete diagram must show:**
1. ✅ Business requirements flow
2. ✅ Kubernetes infrastructure
3. ✅ All services and their connections
4. ✅ ConfigMaps and Secrets
5. ✅ HPA configuration
6. ✅ Database and persistence
7. ✅ Network flow

#### Tools

- Draw.io (https://app.diagrams.net/)
- Excalidraw (https://excalidraw.com/)
- Lucidchart
- Mermaid (code-based diagrams)

#### Example Architecture Diagram Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS REQUIREMENTS                        │
│  Customer → Kiosk → Order → Payment → Kitchen → Pickup          │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                  KUBERNETES CLUSTER (Minikube)                   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Namespace: fast-food                     │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  HPA (min: 2, max: 10, target: 70% CPU)              │ │ │
│  │  │        ↓ manages                                      │ │ │
│  │  │  ┌────────────────────────────────────────────────┐  │ │ │
│  │  │  │  Fast-Food API Deployment                       │  │ │ │
│  │  │  │  ┌──────┐ ┌──────┐ ┌──────┐                    │  │ │ │
│  │  │  │  │Pod 1 │ │Pod 2 │ │Pod 3 │ (auto-scales)      │  │ │ │
│  │  │  │  └──────┘ └──────┘ └──────┘                    │  │ │ │
│  │  │  │  Resources: 250m CPU, 256Mi RAM (requests)      │  │ │ │
│  │  │  │  Image: fast-food-api:v1                        │  │ │ │
│  │  │  └────────────────────────────────────────────────┘  │ │ │
│  │  │        ↓ uses                                         │ │ │
│  │  │  ┌────────────────────┐  ┌──────────────────────┐   │ │ │
│  │  │  │   ConfigMap        │  │      Secret           │   │ │ │
│  │  │  │  - HOST_PORT       │  │  - DATABASE_URL       │   │ │ │
│  │  │  │  - NODE_ENV        │  │                       │   │ │ │
│  │  │  └────────────────────┘  └──────────────────────┘   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │        ↓ exposed by                                        │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Service (NodePort 30080)                             │ │ │
│  │  │  ClusterIP: 10.96.x.x:3000                            │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │        ↓ connects to                                        │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  PostgreSQL Deployment                                │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Pod: Postgres Container                      │    │ │ │
│  │  │  │  Image: postgres:14-alpine                    │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │        ↓ mounts                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  PersistentVolumeClaim (1Gi)                  │    │ │ │
│  │  │  │  Data: /var/lib/postgresql/data               │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │        ↓ exposed by                                        │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Service: postgres-service (ClusterIP)               │ │ │
│  │  │  Internal: postgres-service:5432                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                         ACCESS POINTS                            │
│  minikube service → http://192.168.49.2:30080                   │
│  kubectl port-forward → http://localhost:3000                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Part 2: README Documentation (2-3 hours)

#### Complete README Structure

```markdown
# Fast-Food API - Tech Challenge Phase 2

## Overview
Self-service kiosk API for fast-food restaurant management.

## Architecture
[Insert architecture diagram]

### Technology Stack
- **Backend:** Node.js 20, TypeScript, Express
- **Database:** PostgreSQL 14
- **ORM:** Prisma
- **Container:** Docker
- **Orchestration:** Kubernetes (Minikube)
- **Architecture:** Clean Architecture + Hexagonal (Ports & Adapters)

### Clean Architecture Layers
- **Domain:** Business entities and rules
- **Application:** Use cases and business logic
- **Infrastructure:** External dependencies (Prisma, DB)
- **Presentation:** HTTP controllers (Express)

## Business Requirements

### Customer Flow
1. Identification (optional via CPF)
2. Product selection (Lanche, Acompanhamento, Bebida)
3. Payment (QRCode - Mercado Pago or mock)
4. Order tracking (Recebido → Em Preparação → Pronto → Finalizado)
5. Pickup

### Features
- ✅ Category management (CRUD)
- ✅ Product management (CRUD)
- ✅ Customer management (CRUD)
- ✅ Order management with status workflow
- ✅ Payment integration (webhook)
- ✅ Order listing with priority sorting

## Kubernetes Infrastructure

### Resources
- **Deployments:** API (3 replicas), PostgreSQL (1 replica)
- **Services:** API (NodePort), PostgreSQL (ClusterIP)
- **ConfigMaps:** Application configuration
- **Secrets:** Database credentials
- **HPA:** Auto-scaling (2-10 replicas, 70% CPU target)
- **PVC:** PostgreSQL persistent storage (1Gi)

### Auto-Scaling
HPA monitors CPU usage and scales API pods:
- **Minimum:** 2 replicas
- **Maximum:** 10 replicas
- **Target:** 70% CPU utilization

## Prerequisites

- Docker Desktop
- Kubernetes (Minikube or Kind)
- kubectl
- Node.js 18+
- yarn or npm

## Setup Instructions

### 1. Install Tools

```bash
# Install kubectl
curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube
minikube start

# Enable metrics-server (for HPA)
minikube addons enable metrics-server
```

### 2. Build and Load Image

```bash
# Clone repository
git clone <repository-url>
cd fast-food-api

# Install dependencies
yarn install

# Build Docker image
docker build -t fast-food-api:v1 .

# Load to Minikube
minikube image load fast-food-api:v1
```

### 3. Deploy to Kubernetes

```bash
# Deploy all resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/base/postgres/ -n fast-food
kubectl apply -f k8s/base/ -n fast-food
kubectl apply -f k8s/base/api/ -n fast-food

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=fast-food-api -n fast-food --timeout=180s

# Verify deployment
kubectl get all -n fast-food
```

### 4. Access Application

```bash
# Method 1: Minikube service
minikube service fast-food-api-service -n fast-food

# Method 2: Port forward
kubectl port-forward service/fast-food-api-service 3000:3000 -n fast-food

# Access at http://localhost:3000
```

## API Documentation

### Swagger
Access API documentation: http://localhost:3000/api-docs

### Endpoints

#### Categories
- `GET /api/v1/categories` - List all categories
- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

#### Products
- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/category/:categoryId` - Get products by category
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

#### Orders
- `GET /api/v1/orders` - List orders (sorted by priority)
- `POST /api/v1/orders/checkout` - Create order
- `GET /api/v1/orders/:id` - Get order by ID
- `PUT /api/v1/orders/:id/status` - Update order status
- `GET /api/v1/orders/status/:status` - Get orders by status

#### Payments
- `GET /api/v1/payments/order/:orderId/status` - Check payment status
- `POST /api/v1/webhooks/mercadopago/payment` - Payment webhook

## Execution Guide

### 1. Create Categories
```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Lanche", "description": "Sandwiches"}'
```

### 2. Create Products
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "X-Burger",
    "price": 25.90,
    "categoryId": 1
  }'
```

### 3. Create Order
```bash
curl -X POST http://localhost:3000/api/v1/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "items": [{"productId": 1, "quantity": 2}]
  }'
```

### 4. Update Order Status
```bash
curl -X PUT http://localhost:3000/api/v1/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "PREPARING"}'
```

## Monitoring

### View Logs
```bash
kubectl logs -f deployment/fast-food-api -n fast-food
```

### Check HPA
```bash
kubectl get hpa -n fast-food
```

### View Metrics
```bash
kubectl top pods -n fast-food
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n fast-food
kubectl logs <pod-name> -n fast-food
```

### Database connection issues
```bash
kubectl exec -it deployment/postgres -n fast-food -- psql -U postgres -d fastfood
```

### HPA not scaling
```bash
kubectl describe hpa fast-food-api-hpa -n fast-food
kubectl top pods -n fast-food
```

## Demo Video

[Link to demonstration video]

## Contributors

- [Your Name]

## License

MIT
```

---

### Part 3: Postman Collection (1 hour)

Create and export Postman collection with:
- All endpoints
- Example requests
- Environment variables

Export as: `fast-food-api.postman_collection.json`

---

### Part 4: Final Review (1 hour)

#### Checklist for Tech Challenge Submission

- [ ] Architecture diagram created
- [ ] README.md complete
- [ ] API documentation available (Swagger)
- [ ] Postman collection exported
- [ ] Execution guide written
- [ ] All manifests in k8s/ directory
- [ ] .gitignore includes secrets
- [ ] Demo video ready (tomorrow)

---

## Tomorrow: Video Recording & Final Review

- Record demonstration video
- Final testing
- Submit Tech Challenge

**Almost done! Tomorrow is the final day! 🎬🎉**
