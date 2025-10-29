# Day 14: Video Recording & Final Review

## Learning Objectives
- ✅ Record comprehensive demonstration video
- ✅ Perform final system testing
- ✅ Complete Tech Challenge submission checklist
- ✅ Prepare for submission

---

## Morning Session (3-4 hours)

### Part 1: Video Planning (60 min)

#### Video Requirements

**Duration:** 10-15 minutes
**Platform:** YouTube or Vimeo (public or unlisted)
**Format:** Screen recording with narration

#### Video Script Outline

**1. Introduction (1 min)**
- Project name and purpose
- Your name
- Overview of what will be demonstrated

**2. Architecture Overview (3 min)**
- Show architecture diagram
- Explain business requirements
- Explain infrastructure components
- Show Clean Architecture layers
- Explain HPA and auto-scaling strategy

**3. Kubernetes Infrastructure (4 min)**
- Show Minikube cluster
- Demonstrate: `kubectl get all -n fast-food`
- Show Deployments, Services, ConfigMaps, Secrets
- Explain HPA configuration
- Show: `kubectl get hpa -n fast-food`
- Show metrics: `kubectl top pods -n fast-food`

**4. API Demonstration (4 min)**
- Access Swagger UI
- Show endpoints
- Execute example requests:
  - POST /categories
  - POST /products
  - POST /orders/checkout
  - GET /orders (show sorting)
  - PUT /orders/:id/status
  - POST /webhooks/mercadopago/payment
  - GET /payments/order/:id/status

**5. Auto-Scaling Demonstration (2 min)**
- Show current replicas
- Run load test (briefly)
- Show HPA scaling up
- Show new pods being created

**6. Conclusion (1 min)**
- Summary of what was demonstrated
- Thank you

---

### Part 2: Video Recording (2-3 hours)

#### Recording Tools

**Option 1: OBS Studio (Recommended)**
```bash
# Ubuntu installation
sudo apt install obs-studio

# Or download from https://obsproject.com/
```

**Option 2: SimpleScreenRecorder**
```bash
sudo apt install simplescreenrecorder
```

**Option 3: Kazam**
```bash
sudo apt install kazam
```

**Option 4: Online Tools**
- Loom (https://www.loom.com/)
- Screencast-O-Matic

---

#### Recording Checklist

**Before Recording:**
- [ ] Clean desktop (close unnecessary windows)
- [ ] Increase terminal font size (for readability)
- [ ] Test microphone
- [ ] Prepare all commands in a script
- [ ] Have browser tabs ready (Swagger, Minikube dashboard)
- [ ] Practice run-through

**During Recording:**
- [ ] Speak clearly
- [ ] Explain what you're doing
- [ ] Show results after each command
- [ ] Don't rush
- [ ] Pause if needed (edit later)

**After Recording:**
- [ ] Review video
- [ ] Check audio quality
- [ ] Trim unnecessary parts
- [ ] Add title slide (optional)

---

### Part 3: Upload Video (30 min)

#### YouTube Upload

1. Go to https://studio.youtube.com/
2. Click "Create" → "Upload videos"
3. Upload your video
4. Settings:
   - Title: "Fast-Food API - Tech Challenge Phase 2 - [Your Name]"
   - Description: Project description + GitHub link
   - Visibility: **Unlisted** (required by Tech Challenge)
5. Copy video link

#### Update README

```markdown
## Demo Video

🎥 [Watch demonstration video](https://youtu.be/YOUR_VIDEO_ID)

Video content:
- Architecture overview
- Kubernetes infrastructure walkthrough
- API endpoint demonstrations
- Auto-scaling demonstration
```

---

## Afternoon Session (2-3 hours)

### Part 4: Final Testing (90 min)

#### Complete System Test

**1. Clean Deployment**
```bash
# Delete everything
kubectl delete namespace fast-food

# Fresh deployment
./k8s/deploy.sh

# Wait for ready
kubectl wait --for=condition=ready pod -l app=fast-food-api -n fast-food --timeout=180s
```

**2. Database Test**
```bash
# Connect to database
kubectl exec -it deployment/postgres -n fast-food -- psql -U postgres -d fastfood

# Check migrations
\dt

# Exit
\q
```

**3. API Test**
```bash
# Port forward
kubectl port-forward service/fast-food-api-service 3000:3000 -n fast-food &

# Test health
curl http://localhost:3000/health

# Test category
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Category"}'

# Test product
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": 10.00, "categoryId": 1}'

# Test order
curl -X POST http://localhost:3000/api/v1/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": 1, "quantity": 2}]}'

# List orders (verify sorting)
curl http://localhost:3000/api/v1/orders
```

**4. HPA Test**
```bash
# Check HPA
kubectl get hpa -n fast-food

# Load test
ab -n 5000 -c 50 http://localhost:3000/health

# Watch scaling
kubectl get hpa -n fast-food --watch
```

---

### Part 5: Submission Checklist (60 min)

#### Phase 2 Requirements Verification

**Functional Requirements:**
- [ ] ✅ Clean Architecture implemented
- [ ] ✅ Clean Code principles followed
- [ ] ✅ SOLID principles demonstrated
- [ ] ✅ Hexagonal Architecture (Ports & Adapters)
- [ ] ✅ All business requirements implemented
- [ ] ✅ Webhook implementation clear

**Infrastructure Requirements:**
- [ ] ✅ Kubernetes manifests in repository
- [ ] ✅ HPA configured (2-10 replicas, 70% CPU)
- [ ] ✅ ConfigMaps for configuration
- [ ] ✅ Secrets for sensitive data
- [ ] ✅ Deployments with proper replicas
- [ ] ✅ Services exposing applications
- [ ] ✅ PersistentVolume for database

**Documentation Requirements:**
- [ ] ✅ Architecture diagram (ALL components)
- [ ] ✅ README with complete instructions
- [ ] ✅ API documentation (Swagger or Postman)
- [ ] ✅ Execution guide with examples
- [ ] ✅ Demo video (10-15 min, unlisted)

**Repository Requirements:**
- [ ] ✅ GitHub repository is private
- [ ] ✅ User `soat-architecture` added as collaborator
- [ ] ✅ All code committed and pushed
- [ ] ✅ Secrets NOT committed (.gitignore)

---

#### Final File Structure Check

```
fast-food-api/
├── README.md                          ✅ Complete
├── ARCHITECTURE_DIAGRAM.png           ✅ Created
├── fast-food-api.postman_collection.json  ✅ Exported
├── .gitignore                         ✅ Includes k8s/secret*.yaml
├── k8s/
│   ├── namespace.yaml                 ✅
│   ├── base/
│   │   ├── configmap.yaml             ✅
│   │   ├── secret.yaml                ❌ (gitignored)
│   │   ├── postgres/
│   │   │   ├── deployment.yaml        ✅
│   │   │   ├── service.yaml           ✅
│   │   │   ├── pvc.yaml               ✅
│   │   │   └── secret.yaml            ❌ (gitignored)
│   │   └── api/
│   │       ├── deployment.yaml        ✅
│   │       ├── service.yaml           ✅
│   │       └── hpa.yaml                ✅
│   ├── deploy.sh                      ✅
│   └── README.md                      ✅
├── src/                               ✅ Clean Architecture
└── package.json                       ✅
```

---

### Part 6: GitHub Submission (30 min)

#### Prepare Repository

```bash
# Ensure .gitignore includes secrets
cat >> .gitignore << EOF
# Kubernetes secrets
k8s/*secret*.yaml
k8s/base/*secret*.yaml
k8s/base/postgres/*secret*.yaml
.env
