# Day 12: Complete Kubernetes Deployment

## Learning Objectives
By the end of today, you will:
- ✅ Deploy complete fast-food-api stack to Kubernetes
- ✅ Organize all K8s manifests properly
- ✅ Test end-to-end functionality
- ✅ Implement best practices
- ✅ Prepare for production deployment

---

## Morning Session (3-4 hours)

### Part 1: Review Current State (30 min)

#### What We Have So Far

```
✅ PostgreSQL Deployment + Service
✅ API Deployment + Service  
✅ ConfigMaps (app configuration)
✅ Secrets (database credentials)
✅ HPA (auto-scaling)
✅ Resource limits
✅ Health checks
```

#### What's Missing

```
❌ Proper namespace organization
❌ Network policies (optional but recommended)
❌ Ingress (for production)
❌ Organized file structure
❌ Complete documentation
❌ Backup strategy (optional)
```

---

### Part 2: Organizing Kubernetes Manifests (60 min)

#### Recommended K8s Directory Structure

```
k8s/
├── namespace.yaml
├── base/
│   ├── configmap.yaml
│   ├── secret.yaml               # gitignored
│   ├── postgres/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── pvc.yaml
│   │   └── secret.yaml           # gitignored
│   └── api/
│       ├── deployment.yaml
│       ├── service.yaml
│       └── hpa.yaml
├── overlays/
│   ├── dev/
│   │   ├── kustomization.yaml
│   │   └── configmap-patch.yaml
│   └── prod/
│       ├── kustomization.yaml
│       └── configmap-patch.yaml
└── README.md
```

---

#### Exercise 1: Reorganize Manifests

**Step 1: Create Directory Structure**

```bash
cd ~/fast-food-api/k8s

# Create directories
mkdir -p base/postgres base/api
mkdir -p overlays/dev overlays/prod

# Move files
mv postgres-*.yaml base/postgres/
mv api-*.yaml base/api/
mv *configmap*.yaml base/
mv *secret*.yaml base/  # Remember to gitignore!
```

---

**Step 2: Create Namespace**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fast-food
  labels:
    name: fast-food
    environment: production
```

```bash
kubectl apply -f k8s/namespace.yaml
```

---

**Step 3: Update All Manifests with Namespace**

```yaml
# Add to all manifests
metadata:
  namespace: fast-food
```

Or apply with namespace flag:
```bash
kubectl apply -f k8s/ -n fast-food
```

---

### Part 3: Complete Deployment Stack (90 min)

#### All-in-One Deployment Script

```bash
# k8s/deploy.sh
#!/bin/bash

set -e  # Exit on error

NAMESPACE="fast-food"
echo "🚀 Deploying Fast-Food API to Kubernetes..."

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

# Deploy PostgreSQL
echo "🐘 Deploying PostgreSQL..."
kubectl apply -f base/postgres/secret.yaml -n $NAMESPACE
kubectl apply -f base/postgres/pvc.yaml -n $NAMESPACE
kubectl apply -f base/postgres/deployment.yaml -n $NAMESPACE
kubectl apply -f base/postgres/service.yaml -n $NAMESPACE

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=120s

# Deploy API
echo "🍔 Deploying API..."
kubectl apply -f base/configmap.yaml -n $NAMESPACE
kubectl apply -f base/secret.yaml -n $NAMESPACE
kubectl apply -f base/api/deployment.yaml -n $NAMESPACE
kubectl apply -f base/api/service.yaml -n $NAMESPACE
kubectl apply -f base/api/hpa.yaml -n $NAMESPACE

# Wait for API
echo "⏳ Waiting for API..."
kubectl wait --for=condition=ready pod -l app=fast-food-api -n $NAMESPACE --timeout=180s

# Show status
echo "✅ Deployment complete!"
echo ""
kubectl get all -n $NAMESPACE

echo ""
echo "🌐 Access API:"
echo "kubectl port-forward service/fast-food-api-service 3000:3000 -n $NAMESPACE"
```

```bash
chmod +x k8s/deploy.sh
```

---

#### Deploy Everything

```bash
# Build and load image
docker build -t fast-food-api:v1 .
minikube image load fast-food-api:v1

# Run deployment script
./k8s/deploy.sh

# Or manual deployment
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/base/postgres/ -n fast-food
kubectl apply -f k8s/base/api/ -n fast-food
kubectl apply -f k8s/base/configmap.yaml -n fast-food
kubectl apply -f k8s/base/secret.yaml -n fast-food
```

---

### Part 4: End-to-End Testing (60 min)

#### Test Checklist

**1. Database Connectivity**
```bash
# Connect to PostgreSQL
kubectl exec -it deployment/postgres -n fast-food -- psql -U postgres -d fastfood

# Check tables
\dt
\q
```

**2. API Health**
```bash
# Port forward
kubectl port-forward service/fast-food-api-service 3000:3000 -n fast-food

# Test health endpoint
curl http://localhost:3000/health
```

**3. CRUD Operations**
```bash
# Create Category
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Lanche", "description": "Sandwiches"}'

# List Categories
curl http://localhost:3000/api/v1/categories

# Create Product
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "X-Burger",
    "description": "Delicious burger",
    "price": 25.90,
    "categoryId": 1
  }'

# List Products
curl http://localhost:3000/api/v1/products
```

**4. Auto-Scaling**
```bash
# Watch HPA
kubectl get hpa -n fast-food --watch

# Generate load (in another terminal)
SERVICE_URL=$(minikube service fast-food-api-service -n fast-food --url)
ab -n 10000 -c 100 $SERVICE_URL/api/v1/categories

# Watch pods scale
kubectl get pods -n fast-food -l app=fast-food-api --watch
```

**5. Pod Recovery**
```bash
# Delete a pod
kubectl delete pod -l app=fast-food-api -n fast-food --force --grace-period=0

# Watch automatic recreation
kubectl get pods -n fast-food --watch
```

---

## Afternoon Session (2-3 hours)

### Part 5: Production Best Practices (90 min)

#### 1. Resource Quotas (Namespace Level)

```yaml
# k8s/resource-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: fast-food-quota
  namespace: fast-food
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "5"
    services.nodeports: "3"
```

---

#### 2. Network Policies (Security)

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: fast-food
spec:
  podSelector:
    matchLabels:
      app: fast-food-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend  # Only frontend can access
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

---

#### 3. Pod Disruption Budget

```yaml
# k8s/base/api/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: fast-food-api-pdb
  namespace: fast-food
spec:
  minAvailable: 2  # Keep at least 2 pods during disruptions
  selector:
    matchLabels:
      app: fast-food-api
```

---

#### 4. Readiness Gates (Advanced)

```yaml
# In deployment
spec:
  template:
    spec:
      readinessGates:
      - conditionType: "www.example.com/feature-flag-enabled"
```

---

### Part 6: Monitoring Setup (Optional - 60 min)

#### Install Prometheus & Grafana (Optional)

```bash
# Add Helm repo (if you want monitoring)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3001:80 -n monitoring
# User: admin, Password: prom-operator

# View metrics
open http://localhost:3001
```

---

### Part 7: Backup Strategy (30 min)

#### Database Backup Job

```yaml
# k8s/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: fast-food
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:14-alpine
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -U postgres -h postgres-service fastfood > /backup/backup-$(date +%Y%m%d-%H%M%S).sql
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_PASSWORD
            volumeMounts:
            - name: backup-volume
              mountPath: /backup
          volumes:
          - name: backup-volume
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
```

---

## Final Checklist

### Deployment Checklist

- [ ] All manifests organized in k8s/ directory
- [ ] Namespace created
- [ ] PostgreSQL deployed and accessible
- [ ] API deployed with 3+ replicas
- [ ] Services exposing applications
- [ ] ConfigMaps for configuration
- [ ] Secrets for sensitive data (gitignored!)
- [ ] HPA configured and working
- [ ] Resource requests/limits set
- [ ] Health checks configured
- [ ] All tests passing

### Security Checklist

- [ ] Secrets not committed to Git
- [ ] Resource limits defined
- [ ] Network policies (if needed)
- [ ] Non-root containers
- [ ] Read-only root filesystem (optional)
- [ ] Security context defined

### Documentation Checklist

- [ ] README with deployment instructions
- [ ] Architecture diagram
- [ ] API documentation (Swagger)
- [ ] Troubleshooting guide

---

## Troubleshooting Common Issues

### Issue: Image Pull Error
```bash
# Solution: Load image to Minikube
eval $(minikube docker-env)
docker build -t fast-food-api:v1 .
# Or
minikube image load fast-food-api:v1
```

### Issue: Database Connection Failed
```bash
# Check service DNS
kubectl run test --rm -it --image=busybox -- nslookup postgres-service.fast-food.svc.cluster.local

# Check credentials
kubectl get secret postgres-secret -o yaml
```

### Issue: Pods Stuck in Pending
```bash
# Check events
kubectl describe pod <pod-name>

# Check node resources
kubectl top nodes
```

---

## Tomorrow: Documentation & Architecture Diagram

Tomorrow we'll:
- Create complete architecture diagram
- Write comprehensive README
- Document setup instructions
- Prepare API documentation
- Create execution guide

---

**Excellent work! Your complete stack is now running in Kubernetes! 🎉☸️**
