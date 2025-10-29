# Day 11: Horizontal Pod Autoscaler (HPA)

## Learning Objectives
By the end of today, you will:
- ✅ Understand Horizontal Pod Autoscaling
- ✅ Install and configure Metrics Server
- ✅ Create HPA for fast-food-api
- ✅ Perform load testing to trigger scaling
- ✅ Monitor and troubleshoot HPA

---

## Morning Session (3-4 hours)

### Part 1: Understanding Auto-Scaling (45 min)

#### The Problem: Fixed Capacity

```
Scenario: Fast-food kiosk at lunch time

11:00 AM - 3 replicas  → Low traffic ✅
12:00 PM - 3 replicas  → HIGH traffic! ⚠️ Slow responses!
13:00 PM - 3 replicas  → Very slow! 😱 Customers leaving!
14:00 PM - 3 replicas  → Traffic drops, wasted resources 💸
```

**Manual scaling:**
```bash
# Someone needs to watch metrics and scale manually
kubectl scale deployment fast-food-api --replicas=10  # Lunch rush
# Wait 2 hours...
kubectl scale deployment fast-food-api --replicas=3   # After lunch
```

❌ Slow response
❌ Human intervention required
❌ Wastes resources

---

#### The Solution: HPA (Horizontal Pod Autoscaler)

```
Scenario: Same kiosk with HPA

11:00 AM - 3 replicas  → Low CPU ✅
12:00 PM - Auto scales to 8 replicas 🚀 (High CPU detected)
13:00 PM - 8 replicas handling load ✅
14:00 PM - Auto scales down to 3 🎯 (CPU drops)
```

**Automatic scaling:**
- ✅ No human intervention
- ✅ Fast response to load
- ✅ Cost-effective
- ✅ Always available

---

#### What is HPA?

**Horizontal Pod Autoscaler** = Automatically scales Pods based on metrics

**Metrics:**
- CPU utilization (most common)
- Memory utilization
- Custom metrics (requests/sec, queue length, etc.)

**How it works:**
```
1. Metrics Server collects metrics from Pods
2. HPA checks metrics every 15 seconds
3. If metric > target: Scale UP
4. If metric < target: Scale DOWN
5. Respects min/max replica limits
```

---

#### Horizontal vs Vertical Scaling

**Horizontal Scaling (HPA)**
```
Before: Pod(CPU: 80%)
After:  Pod(CPU: 40%) + Pod(CPU: 40%)

Add MORE pods
```

**Vertical Scaling (VPA)**
```
Before: Pod(CPU: 1 core, RAM: 512Mi)
After:  Pod(CPU: 2 cores, RAM: 1Gi)

Make pods BIGGER
```

**We're focusing on Horizontal Scaling (HPA) today!**

---

### Part 2: Installing Metrics Server (45 min)

#### What is Metrics Server?

**Metrics Server** = Collects resource metrics (CPU, memory) from Kubelet

```
┌──────────────────────────┐
│     Metrics Server       │  ← Aggregates metrics
└────────┬─────────────────┘
         │ collects from
    ┌────┼────┬────────────┐
    ▼    ▼    ▼            ▼
  Node1 Node2 Node3 ... NodeN
  (kubelet metrics)
```

**Provides:**
- `kubectl top nodes` - Node metrics
- `kubectl top pods` - Pod metrics
- Data for HPA decisions

---

#### Install Metrics Server on Minikube

**Option 1: Minikube Addon (Easiest)**

```bash
# Enable metrics-server addon
minikube addons enable metrics-server

# Verify
minikube addons list | grep metrics-server
```

**Expected output:**
```
| metrics-server              | minikube | enabled ✅   |
```

---

**Option 2: Manual Installation**

```bash
# Download metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# For Minikube, patch to disable TLS
kubectl patch deployment metrics-server -n kube-system --type='json' \
  -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]'
```

---

#### Verify Metrics Server

```bash
# Wait for metrics-server pod to be ready
kubectl get pods -n kube-system | grep metrics-server

# Test kubectl top (wait ~1 minute after enabling)
kubectl top nodes

# Expected output:
NAME       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
minikube   250m         12%    1024Mi          25%

# View pod metrics
kubectl top pods

# If error "Metrics API not available", wait 1-2 minutes
```

---

### Part 3: Creating HPA (60 min)

#### HPA YAML Structure

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fast-food-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fast-food-api      # Target deployment
  minReplicas: 2             # Minimum pods
  maxReplicas: 10            # Maximum pods
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Target 70% CPU
```

**Behavior:**
- If average CPU > 70% → Scale UP
- If average CPU < 70% → Scale DOWN
- Never below 2 replicas
- Never above 10 replicas

---

#### Exercise 1: Create CPU-Based HPA

**Step 1: Ensure Deployment has Resource Requests**

HPA REQUIRES resource requests to calculate percentage!

```yaml
# k8s/api-deployment.yaml (check this exists)
spec:
  template:
    spec:
      containers:
      - name: api
        resources:
          requests:
            cpu: "250m"      # Required for HPA!
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
```

If missing, add and apply:
```bash
kubectl apply -f k8s/api-deployment.yaml
```

---

**Step 2: Create HPA Manifest**

```yaml
# k8s/api-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fast-food-api-hpa
  labels:
    app: fast-food-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fast-food-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300  # Wait 5 min before scale down
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0  # Scale up immediately
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
```

---

**Step 3: Apply HPA**

```bash
# Create HPA
kubectl apply -f k8s/api-hpa.yaml

# View HPA
kubectl get hpa
kubectl get hpa fast-food-api-hpa --watch
```

**Expected output:**
```
NAME                  REFERENCE                 TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
fast-food-api-hpa     Deployment/fast-food-api  15%/70%   2         10        2          10s
```

**Fields explained:**
- `TARGETS`: Current/Target CPU (15% current, 70% target)
- `MINPODS`: Minimum replicas
- `MAXPODS`: Maximum replicas
- `REPLICAS`: Current replicas

---

**Step 4: Verify Auto-Scaling to Min Replicas**

```bash
# Current replicas in deployment
kubectl get deployment fast-food-api

# HPA should adjust to minReplicas (2)
# Wait a moment and check
kubectl get pods -l app=fast-food-api

# Should see 2 pods (if deployment had more)
```

---

#### Exercise 2: Multi-Metric HPA (Advanced)

```yaml
# k8s/api-hpa-multi.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fast-food-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fast-food-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  # CPU metric
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  # Memory metric
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  # Scale if EITHER metric exceeds target
```

---

### Part 4: Load Testing (60 min)

#### Install Load Testing Tool

**Option 1: Apache Bench (ab)**

```bash
# Ubuntu/Debian
sudo apt-get install apache2-utils

# Test
ab -V
```

**Option 2: k6 (Recommended)**

```bash
# Install k6
curl https://github.com/grafana/k6/releases/download/v0.48.0/k6-v0.48.0-linux-amd64.tar.gz -L | tar xvz
sudo mv k6-v0.48.0-linux-amd64/k6 /usr/local/bin/

# Test
k6 version
```

**Option 3: hey**

```bash
# Install hey
go install github.com/rakyll/hey@latest

# Or download binary
wget https://hey-release.s3.us-east-2.amazonaws.com/hey_linux_amd64
chmod +x hey_linux_amd64
sudo mv hey_linux_amd64 /usr/local/bin/hey
```

---

#### Exercise 3: Trigger Auto-Scaling

**Step 1: Expose Service**

```bash
# Get Minikube IP and NodePort
minikube service fast-food-api-service --url

# Example output: http://192.168.49.2:30080
# Use this URL for load testing
```

---

**Step 2: Baseline Metrics**

```bash
# Before load test
kubectl top pods -l app=fast-food-api
kubectl get hpa fast-food-api-hpa
```

---

**Step 3: Run Load Test (Apache Bench)**

```bash
# Get service URL
SERVICE_URL=$(minikube service fast-food-api-service --url)

# Load test: 100 concurrent requests, 10000 total
ab -n 10000 -c 100 $SERVICE_URL/api/v1/categories

# Or simple endpoint
ab -n 10000 -c 100 $SERVICE_URL/health
```

---

**Step 4: Run Load Test (k6)**

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function () {
  const BASE_URL = __ENV.SERVICE_URL;
  let res = http.get(`${BASE_URL}/api/v1/categories`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

```bash
# Run k6 test
export SERVICE_URL=$(minikube service fast-food-api-service --url)
k6 run load-test.js
```

---

**Step 5: Watch Scaling in Real-Time**

Open 3 terminals:

**Terminal 1: Watch HPA**
```bash
kubectl get hpa fast-food-api-hpa --watch
```

**Terminal 2: Watch Pods**
```bash
kubectl get pods -l app=fast-food-api --watch
```

**Terminal 3: Watch Metrics**
```bash
watch -n 2 'kubectl top pods -l app=fast-food-api'
```

---

**Step 6: Observe Scaling Up**

```
Initial:
REPLICAS: 2
CPU: 20%

During load test:
REPLICAS: 2
CPU: 85% → Exceeds 70% target!

After ~30 seconds:
REPLICAS: 4 → Scaled up!
CPU: 60%

If still high:
REPLICAS: 6
CPU: 50%
```

---

**Step 7: Observe Scaling Down**

```bash
# Stop load test (Ctrl+C)

# Watch scale down (takes ~5 minutes due to stabilizationWindow)
kubectl get hpa --watch

# Eventually scales back to minReplicas (2)
```

---

## Afternoon Session (2-3 hours)

### Part 5: HPA Algorithms & Tuning (60 min)

#### How HPA Calculates Desired Replicas

**Formula:**
```
desiredReplicas = ceil[currentReplicas * (currentMetricValue / targetMetricValue)]
```

**Example:**
```
Current: 3 replicas, 90% CPU
Target: 70% CPU

desiredReplicas = ceil[3 * (90 / 70)]
                = ceil[3 * 1.285]
                = ceil[3.855]
                = 4 replicas
```

---

#### Scaling Policies

**Scale Up Behavior:**
```yaml
scaleUp:
  stabilizationWindowSeconds: 0  # Scale immediately
  policies:
  - type: Percent
    value: 100      # Double pods at once
    periodSeconds: 15
  - type: Pods
    value: 4        # Or add 4 pods max
    periodSeconds: 15
  selectPolicy: Max  # Use policy that adds more
```

**Scale Down Behavior:**
```yaml
scaleDown:
  stabilizationWindowSeconds: 300  # Wait 5 minutes
  policies:
  - type: Percent
    value: 50       # Remove 50% at once
    periodSeconds: 60
  selectPolicy: Min  # Use conservative policy
```

---

#### Tuning HPA

**Conservative (Production):**
```yaml
minReplicas: 3
maxReplicas: 20
averageUtilization: 60  # Scale earlier
scaleDown:
  stabilizationWindowSeconds: 600  # 10 min wait
```

**Aggressive (Cost-saving):**
```yaml
minReplicas: 1
maxReplicas: 5
averageUtilization: 80  # Scale later
scaleDown:
  stabilizationWindowSeconds: 120  # 2 min wait
```

---

### Part 6: Troubleshooting HPA (45 min)

#### Common Issues

**Issue 1: HPA shows `<unknown>` for metrics**

```bash
kubectl get hpa
# NAME                  TARGETS         MINPODS   MAXPODS   REPLICAS
# fast-food-api-hpa     <unknown>/70%   2         10        0
```

**Causes & Solutions:**
```bash
# 1. Metrics Server not installed
kubectl get apiservice v1beta1.metrics.k8s.io

# 2. Deployment missing resource requests
kubectl get deployment fast-food-api -o yaml | grep -A 3 resources

# 3. Metrics not ready yet (wait 1-2 minutes)
kubectl top pods

# 4. Check metrics-server logs
kubectl logs -n kube-system deployment/metrics-server
```

---

**Issue 2: HPA not scaling**

```bash
# Check HPA status
kubectl describe hpa fast-food-api-hpa

# Look for conditions and events:
# - AbleToScale: True
# - ScalingActive: True
# - ScalingLimited: False

# Check current metrics
kubectl get hpa fast-food-api-hpa
# If TARGETS shows 15%/70%, CPU is too low to scale

# Generate load to test
ab -n 10000 -c 100 <service-url>/health
```

---

**Issue 3: Scaling too aggressively**

```yaml
# Add stabilization window
scaleUp:
  stabilizationWindowSeconds: 60  # Wait 1 min before scale up

# Reduce scale up rate
policies:
- type: Percent
  value: 50        # Add only 50% more pods
  periodSeconds: 30
```

---

**Issue 4: Can't scale below minReplicas**

```bash
# Check HPA events
kubectl describe hpa fast-food-api-hpa

# Event: "the desired replica count is more than the maximum replica count"
# This is normal - HPA respects minReplicas/maxReplicas
```

---

### Part 7: Monitoring & Metrics (45 min)

#### Viewing HPA Status

```bash
# List all HPAs
kubectl get hpa

# Watch HPA
kubectl get hpa --watch

# Detailed HPA info
kubectl describe hpa fast-food-api-hpa

# HPA in YAML
kubectl get hpa fast-food-api-hpa -o yaml
```

---

#### Pod Metrics

```bash
# Current pod metrics
kubectl top pods -l app=fast-food-api

# Specific pod
kubectl top pod <pod-name>

# Sort by CPU
kubectl top pods --sort-by=cpu

# Sort by memory
kubectl top pods --sort-by=memory
```

---

#### Node Metrics

```bash
# Node metrics
kubectl top nodes

# Sorted by CPU
kubectl top nodes --sort-by=cpu
```

---

#### HPA Events

```bash
# Recent HPA events
kubectl get events --sort-by='.lastTimestamp' | grep -i hpa

# Specific HPA events
kubectl describe hpa fast-food-api-hpa | grep -A 10 Events
```

---

## End of Day Review (30 min)

### Self-Assessment Questions

1. **What is Horizontal Pod Autoscaler?**
2. **What is Metrics Server?**
3. **What metrics can HPA use?**
4. **How long does HPA wait before scaling down?**
5. **Why are resource requests required for HPA?**

### Answers:
1. Automatically scales number of pods based on metrics
2. Collects resource metrics from kubelet for HPA and kubectl top
3. CPU utilization, memory utilization, custom metrics
4. Default 5 minutes (stabilizationWindowSeconds: 300)
5. HPA calculates percentage based on requested resources

---

### Checklist for Day 11

- [ ] I understand HPA concept
- [ ] Metrics Server is installed and working
- [ ] I created HPA for fast-food-api
- [ ] I performed load testing
- [ ] I observed auto-scaling up and down
- [ ] I know how to troubleshoot HPA

---

## Tomorrow: Complete Kubernetes Deployment

Tomorrow we'll:
- Deploy complete stack to Kubernetes
- Add remaining services (if any)
- Configure proper networking
- Test end-to-end flows
- Document the deployment

**Prep:** Review all K8s manifests created this week

---

**Excellent work! Your application now auto-scales based on demand! 🚀📈**
