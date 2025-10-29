# Day 9: Deployments & Services

## Learning Objectives
By the end of today, you will:
- ✅ Understand Kubernetes Deployments and ReplicaSets
- ✅ Create and manage Deployments
- ✅ Understand Service types and networking
- ✅ Expose applications using Services
- ✅ Perform rolling updates and rollbacks
- ✅ Deploy fast-food-api with proper Service

---

## Morning Session (3-4 hours)

### Part 1: Why Deployments? (45 min)

#### The Problem with Pods

Yesterday we created Pods directly. But there's a problem:

```bash
# Create a pod
kubectl run api --image=fast-food-api:v1

# Pod crashes
# Pod is gone forever! 😱

# Want 3 replicas?
kubectl run api-1 --image=fast-food-api:v1
kubectl run api-2 --image=fast-food-api:v1
kubectl run api-3 --image=fast-food-api:v1
# Tedious! And manual management! 😤

# Want to update to v2?
# Delete each pod and recreate manually
# Downtime! 😱
```

**Problems:**
- ❌ No automatic restart if pod dies
- ❌ No scaling (need to create pods manually)
- ❌ No rolling updates
- ❌ No rollback capability
- ❌ Manual management

---

#### The Solution: Deployments

**Deployment** = Declarative way to manage Pods and ReplicaSets

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fast-food-api
spec:
  replicas: 3  # I want 3 pods always!
  selector:
    matchLabels:
      app: fast-food-api
  template:
    # Pod template
    spec:
      containers:
      - name: api
        image: fast-food-api:v1
```

**Benefits:**
- ✅ Automatic pod restart
- ✅ Easy scaling (change replicas number)
- ✅ Rolling updates (zero downtime)
- ✅ Rollback capability
- ✅ Declarative management

---

#### Deployment → ReplicaSet → Pods

```
┌─────────────────────────────────────────┐
│           Deployment                     │
│  ┌───────────────────────────────────┐  │
│  │  Desired state: 3 replicas        │  │
│  │  Image: fast-food-api:v1          │  │
│  │  Update strategy: RollingUpdate   │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │ manages
                   ▼
┌─────────────────────────────────────────┐
│           ReplicaSet                     │
│  ┌───────────────────────────────────┐  │
│  │  Ensures 3 pods are running       │  │
│  │  Creates new pods if needed       │  │
│  │  Deletes extra pods               │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │ creates & monitors
                   ▼
┌─────────────────────────────────────────┐
│              Pods                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Pod 1  │  │  Pod 2  │  │  Pod 3  │ │
│  │ Running │  │ Running │  │ Running │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

**You manage:** Deployment (desired state)
**K8s manages:** ReplicaSet and Pods (actual state)

---

### Part 2: Creating Deployments (60 min)

#### Basic Deployment Structure

```yaml
apiVersion: apps/v1            # API version for Deployments
kind: Deployment                # Resource type
metadata:
  name: my-app                  # Deployment name
  labels:
    app: my-app                 # Labels for organization
spec:
  replicas: 3                   # Desired number of pods
  selector:                     # How to find pods to manage
    matchLabels:
      app: my-app               # Must match template labels
  template:                     # Pod template
    metadata:
      labels:
        app: my-app             # Pod labels
    spec:                       # Pod specification
      containers:
      - name: app
        image: my-app:v1
        ports:
        - containerPort: 3000
```

---

#### Exercise 1: Create NGINX Deployment

**Step 1: Create Deployment YAML**

```yaml
# k8s/exercises/nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
```

---

**Step 2: Deploy**

```bash
# Apply deployment
kubectl apply -f k8s/exercises/nginx-deployment.yaml

# Watch pods being created
kubectl get pods --watch

# Expected: 3 pods created
kubectl get pods
```

**Expected output:**
```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7d459cf5c8-2xp7k   1/1     Running   0          10s
nginx-deployment-7d459cf5c8-h8wqm   1/1     Running   0          10s
nginx-deployment-7d459cf5c8-xt9cv   1/1     Running   0          10s
```

---

**Step 3: Inspect Deployment**

```bash
# View deployment
kubectl get deployments
kubectl get deploy  # Short version

# Detailed info
kubectl describe deployment nginx-deployment

# View ReplicaSet (automatically created)
kubectl get replicasets
kubectl get rs  # Short version

# View relationship
kubectl get all -l app=nginx
```

---

**Step 4: Test Self-Healing**

```bash
# Delete a pod
kubectl delete pod nginx-deployment-7d459cf5c8-2xp7k

# Watch what happens
kubectl get pods --watch

# A NEW pod is automatically created! 🎉
# ReplicaSet ensures 3 pods always running
```

---

**Step 5: Scale Deployment**

```bash
# Scale up to 5 replicas
kubectl scale deployment nginx-deployment --replicas=5

# Watch scaling
kubectl get pods --watch

# Scale down to 2
kubectl scale deployment nginx-deployment --replicas=2

# Or edit YAML and apply
# (Change replicas: 2 in YAML)
kubectl apply -f k8s/exercises/nginx-deployment.yaml
```

---

#### Exercise 2: Fast-Food API Deployment

**Step 1: Create Deployment**

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fast-food-api
  labels:
    app: fast-food-api
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fast-food-api
  template:
    metadata:
      labels:
        app: fast-food-api
        tier: backend
    spec:
      containers:
      - name: api
        image: fast-food-api:v1
        imagePullPolicy: Never  # Use local Minikube image
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: HOST_PORT
          value: "3000"
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        # Health checks
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
```

---

**Step 2: Add Health Endpoint (if not exists)**

```typescript
// src/presentation/controllers/http/express/app.ts
// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    })
})
```

Rebuild and load image:
```bash
docker build -t fast-food-api:v1 .
minikube image load fast-food-api:v1
```

---

**Step 3: Deploy**

```bash
# Apply deployment
kubectl apply -f k8s/api-deployment.yaml

# Watch pods
kubectl get pods --watch

# Check deployment status
kubectl rollout status deployment/fast-food-api

# View details
kubectl describe deployment fast-food-api
```

---

**Step 4: Test Self-Healing**

```bash
# List pods
kubectl get pods

# Delete one pod
kubectl delete pod <pod-name>

# Watch automatic recreation
kubectl get pods --watch

# ReplicaSet automatically creates new pod! ✅
```

---

### Part 3: Services - Networking in Kubernetes (60 min)

#### Why Services?

**Problem: Pods are ephemeral**

```
Pod 1 (IP: 10.1.1.1) ← How to reach it?
Pod crashes...
New Pod 1 (IP: 10.1.1.5) ← Different IP! 😱

3 API pods:
- Pod 1: 10.1.1.1
- Pod 2: 10.1.1.2
- Pod 3: 10.1.1.3
Which one should I call? How to load balance? 🤔
```

**Solution: Service**

```
Service (stable IP: 10.96.0.10)
    ↓ load balances to
┌──────┬──────┬──────┐
│Pod 1 │Pod 2 │Pod 3 │
└──────┴──────┴──────┘

Pods can change, Service IP stays the same! ✅
```

---

#### What is a Service?

**Service** = Stable network endpoint for a set of Pods

**Provides:**
- Stable IP address (doesn't change)
- Stable DNS name
- Load balancing across pods
- Service discovery

---

#### Service Types

**1. ClusterIP (Default)**
```yaml
type: ClusterIP
```
- Internal only (within cluster)
- Other pods can access
- NOT accessible from outside
- Use for: internal services (databases, APIs between services)

```
┌────────────────────────────┐
│  Kubernetes Cluster        │
│  ┌──────────────────────┐  │
│  │  ClusterIP Service   │  │
│  │  10.96.0.10:3000     │  │
│  └─────────┬────────────┘  │
│            ↓               │
│  ┌─────┬─────┬─────┐      │
│  │Pod 1│Pod 2│Pod 3│      │
│  └─────┴─────┴─────┘      │
└────────────────────────────┘
         ↑
  Can't access from outside
```

---

**2. NodePort**
```yaml
type: NodePort
```
- Accessible from outside cluster
- Opens port on each Node
- Port range: 30000-32767
- Use for: development, testing

```
┌────────────────────────────┐
│  Kubernetes Cluster        │
│  ┌──────────────────────┐  │
│  │  NodePort Service    │  │
│  │  NodePort: 30080     │  │
│  └─────────┬────────────┘  │
│            ↓               │
│  ┌─────┬─────┬─────┐      │
│  │Pod 1│Pod 2│Pod 3│      │
│  └─────┴─────┴─────┘      │
└────────────────────────────┘
         ↑
  Access: <NodeIP>:30080
```

---

**3. LoadBalancer**
```yaml
type: LoadBalancer
```
- Cloud provider load balancer
- External IP from cloud (AWS ELB, GCP LB)
- Use for: production external access
- **Note:** Works on cloud, not Minikube (Minikube uses `minikube tunnel`)

```
┌─────────────────────────────┐
│  Cloud Load Balancer        │
│  External IP: 34.123.45.67  │
└──────────────┬──────────────┘
               ↓
┌──────────────────────────────┐
│  Kubernetes Cluster          │
│  ┌────────────────────────┐  │
│  │  LoadBalancer Service  │  │
│  └─────────┬──────────────┘  │
│            ↓                 │
│  ┌─────┬─────┬─────┐        │
│  │Pod 1│Pod 2│Pod 3│        │
│  └─────┴─────┴─────┘        │
└──────────────────────────────┘
```

---

#### Service YAML Structure

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP  # or NodePort, LoadBalancer
  selector:
    app: my-app    # Pods with this label
  ports:
  - port: 80       # Service port (ClusterIP)
    targetPort: 8080  # Container port
    nodePort: 30080   # Node port (only for NodePort type)
    protocol: TCP
    name: http
```

**Port mapping explained:**
```
Client → Service (port: 80) → Pod (targetPort: 8080)

For NodePort:
External → Node (nodePort: 30080) → Service (port: 80) → Pod (targetPort: 8080)
```

---

## Afternoon Session (3-4 hours)

### Part 4: Creating Services (90 min)

#### Exercise 1: ClusterIP Service for API

```yaml
# k8s/api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: fast-food-api-service
  labels:
    app: fast-food-api
spec:
  type: ClusterIP
  selector:
    app: fast-food-api  # Matches deployment pods
  ports:
  - port: 3000          # Service port
    targetPort: 3000    # Container port
    protocol: TCP
    name: http
```

**Apply and test:**

```bash
# Create service
kubectl apply -f k8s/api-service.yaml

# View service
kubectl get services
kubectl get svc  # Short version

# Describe service
kubectl describe service fast-food-api-service
```

**Expected output:**
```
NAME                      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
fast-food-api-service     ClusterIP   10.96.123.45    <none>        3000/TCP   10s
```

**Test from inside cluster:**

```bash
# Create test pod
kubectl run test-pod --image=curlimages/curl --rm -it --restart=Never -- sh

# Inside test pod:
curl http://fast-food-api-service:3000/health
curl http://fast-food-api-service:3000/api/v1/categories

exit
```

---

#### Exercise 2: NodePort Service for External Access

```yaml
# k8s/exercises/api-service-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: fast-food-api-nodeport
spec:
  type: NodePort
  selector:
    app: fast-food-api
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30080  # Optional - K8s will assign if omitted
    protocol: TCP
    name: http
```

**Apply and access:**

```bash
# Create service
kubectl apply -f k8s/exercises/api-service-nodeport.yaml

# Get service
kubectl get service fast-food-api-nodeport

# Get Minikube IP
minikube ip

# Access via browser or curl
curl http://$(minikube ip):30080/health

# Or use minikube service command
minikube service fast-food-api-nodeport

# Opens browser automatically!
```

---

#### Exercise 3: Service Discovery

Services create DNS entries:

```
<service-name>.<namespace>.svc.cluster.local

Examples:
fast-food-api-service.default.svc.cluster.local
postgres-service.default.svc.cluster.local

Short forms (within same namespace):
fast-food-api-service
postgres-service
```

**Test DNS:**

```bash
# Create test pod
kubectl run test-dns --image=busybox --rm -it --restart=Never -- sh

# Inside pod, test DNS:
nslookup fast-food-api-service
# Returns service IP

wget -q -O- http://fast-food-api-service:3000/health
# Calls service

exit
```

---

### Part 5: Rolling Updates & Rollbacks (60 min)

#### Rolling Update Strategy

**Zero-downtime updates:**

```
Old version (v1):  🟢 🟢 🟢
                    ↓
Update starts:     🟢 🟢 🔵
                    ↓
Rolling:           🟢 🔵 🔵
                    ↓
Rolling:           🔵 🔵 🔵
New version (v2):  🔵 🔵 🔵

✅ Always some pods available during update!
```

---

#### Update Strategies

**RollingUpdate (Default)**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max new pods during update
      maxUnavailable: 0  # Max unavailable pods
```

**Recreate (Downtime)**
```yaml
spec:
  strategy:
    type: Recreate  # Kills all, then creates new
```

---

#### Exercise: Perform Rolling Update

**Step 1: Update Image Version**

```bash
# Method 1: Update YAML and apply
# Edit k8s/api-deployment.yaml
# Change: image: fast-food-api:v1 → fast-food-api:v2

# Build new version
docker build -t fast-food-api:v2 .
minikube image load fast-food-api:v2

# Apply
kubectl apply -f k8s/api-deployment.yaml

# Method 2: Kubectl set image
kubectl set image deployment/fast-food-api api=fast-food-api:v2
```

---

**Step 2: Watch Rolling Update**

```bash
# Watch rollout
kubectl rollout status deployment/fast-food-api

# Watch pods
kubectl get pods --watch

# You'll see:
# - New pods created
# - Old pods terminated
# - Gradual replacement
```

---

**Step 3: View Rollout History**

```bash
# View history
kubectl rollout history deployment/fast-food-api

# View specific revision
kubectl rollout history deployment/fast-food-api --revision=2
```

---

**Step 4: Rollback if Needed**

```bash
# Rollback to previous version
kubectl rollout undo deployment/fast-food-api

# Rollback to specific revision
kubectl rollout undo deployment/fast-food-api --to-revision=1

# Watch rollback
kubectl rollout status deployment/fast-food-api
```

---

#### Exercise: Canary Deployment (Advanced)

**Canary** = Deploy new version to small subset of users first

```yaml
# Deployment v1 (90% traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-v1
spec:
  replicas: 9
  template:
    metadata:
      labels:
        app: api
        version: v1
    spec:
      containers:
      - name: api
        image: fast-food-api:v1
---
# Deployment v2 (10% traffic - canary)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-v2
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: api
        version: v2
    spec:
      containers:
      - name: api
        image: fast-food-api:v2
---
# Service targets both
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api  # Matches both v1 and v2
  ports:
  - port: 3000
```

**If v2 is good:** Scale v2 up, v1 down
**If v2 has issues:** Delete v2 deployment

---

### Part 6: Complete Fast-Food API Deployment (30 min)

**Final production-ready deployment:**

```yaml
# k8s/api-deployment-final.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fast-food-api
  labels:
    app: fast-food-api
    tier: backend
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: fast-food-api
  template:
    metadata:
      labels:
        app: fast-food-api
        tier: backend
        version: v1
    spec:
      containers:
      - name: api
        image: fast-food-api:v1
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        env:
        - name: HOST_PORT
          value: "3000"
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
---
apiVersion: v1
kind: Service
metadata:
  name: fast-food-api-service
  labels:
    app: fast-food-api
spec:
  type: NodePort
  selector:
    app: fast-food-api
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30080
    protocol: TCP
    name: http
```

**Deploy:**

```bash
kubectl apply -f k8s/api-deployment-final.yaml
kubectl rollout status deployment/fast-food-api
kubectl get all -l app=fast-food-api
minikube service fast-food-api-service
```

---

## End of Day Review (30 min)

### Self-Assessment Questions

1. **What is the difference between Deployment and Pod?**
2. **What does a ReplicaSet do?**
3. **What are the 3 Service types?**
4. **How does rolling update work?**
5. **How do you rollback a deployment?**

### Answers:
1. Pod = single instance. Deployment = manages multiple Pods with scaling, updates, rollback
2. Ensures desired number of identical Pods are running
3. ClusterIP (internal), NodePort (external via node port), LoadBalancer (external via cloud LB)
4. Gradually replaces old pods with new ones, ensuring availability
5. `kubectl rollout undo deployment/<name>`

---

### Checklist for Day 9

- [ ] I understand Deployments and ReplicaSets
- [ ] I created and managed Deployments
- [ ] I understand Service types
- [ ] I exposed applications using Services
- [ ] I performed rolling updates
- [ ] I know how to rollback
- [ ] Fast-food-api is running with Service

---

## Tomorrow: ConfigMaps & Secrets

Tomorrow we'll learn:
- Separate configuration from code
- Use ConfigMaps for non-sensitive data
- Use Secrets for sensitive data
- Connect to PostgreSQL database

**Prep:** Think about what configuration your app needs (DATABASE_URL, ports, etc.)

---

**Great work today! Your app is now properly deployed and accessible! 🎉🚀**
