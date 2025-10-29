# Day 8: Kubernetes Fundamentals

## Learning Objectives
By the end of today, you will:
- ✅ Understand what Kubernetes is and why it's used
- ✅ Install and configure kubectl and Minikube
- ✅ Understand core Kubernetes concepts (Pods, Nodes, Cluster)
- ✅ Execute basic kubectl commands
- ✅ Deploy your first application to Kubernetes

---

## Morning Session (3-4 hours)

### Part 1: What is Kubernetes? (60 min)

#### The Problem Kubernetes Solves

**Scenario: Running containers in production**

```
You have 100 Docker containers running your microservices:
- Some containers crash and need restart
- Traffic spikes require scaling up/down
- Deployments need zero-downtime updates
- Containers need to find each other
- Resources need to be managed efficiently
- Health checks need to be automated

Managing this manually is IMPOSSIBLE! 🤯
```

**Enter Kubernetes!**

---

#### What is Kubernetes?

**Kubernetes (K8s)** = Open-source container orchestration platform

**Think of it as:**
- **Operating System for containers** - Like Linux manages processes, K8s manages containers
- **Smart scheduler** - Decides where to run containers
- **Self-healing system** - Automatically restarts failed containers
- **Traffic manager** - Routes requests to healthy containers
- **Deployment automator** - Updates with zero downtime

---

#### Real-World Analogy

Imagine you manage a restaurant (your application):

**Without Kubernetes (Manual Management):**
```
You personally:
- Assign chefs to stations
- Replace sick chefs
- Add more chefs during rush hour
- Remove chefs during slow times
- Direct customers to available tables
- Monitor kitchen health

Exhausting! 😓
```

**With Kubernetes (Automated Orchestration):**
```
You tell the system:
"I need 3 chefs for burgers, 2 for fries"
"Auto-add more if wait time > 5 min"
"Replace any chef who gets sick"
"Always keep kitchen running"

K8s handles everything! 🎉
```

---

#### Why Kubernetes?

| Challenge | Kubernetes Solution |
|-----------|-------------------|
| Container crashes | Automatic restart |
| Need more capacity | Auto-scale pods |
| Deployment updates | Rolling updates (zero downtime) |
| Service discovery | Built-in DNS |
| Load balancing | Automatic traffic distribution |
| Configuration management | ConfigMaps & Secrets |
| Resource limits | CPU/Memory constraints |
| Persistent data | Volumes |

---

### Part 2: Kubernetes Architecture (60 min)

#### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     KUBERNETES CLUSTER                    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │            CONTROL PLANE (Master)                │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │    │
│  │  │   API    │  │Scheduler │  │Controller│     │    │
│  │  │  Server  │  │          │  │ Manager  │     │    │
│  │  └──────────┘  └──────────┘  └──────────┘     │    │
│  │  ┌──────────────────────────────────────┐     │    │
│  │  │           etcd (Database)             │     │    │
│  │  └──────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────┘    │
│                           │                               │
│                           │ manages                       │
│                           ▼                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              WORKER NODES                        │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐│    │
│  │  │   Node 1   │  │   Node 2   │  │   Node 3   ││    │
│  │  │  ┌──────┐  │  │  ┌──────┐  │  │  ┌──────┐  ││    │
│  │  │  │ Pod  │  │  │  │ Pod  │  │  │  │ Pod  │  ││    │
│  │  │  └──────┘  │  │  └──────┘  │  │  └──────┘  ││    │
│  │  │  ┌──────┐  │  │  ┌──────┐  │  │  ┌──────┐  ││    │
│  │  │  │ Pod  │  │  │  │ Pod  │  │  │  │ Pod  │  ││    │
│  │  │  └──────┘  │  │  └──────┘  │  │  └──────┘  ││    │
│  │  └────────────┘  └────────────┘  └────────────┘│    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

#### Core Components Explained

**1. Control Plane (Master) Components**

**API Server**
- The "front desk" of Kubernetes
- All commands go through here
- REST API for all operations
- When you run `kubectl`, it talks to API Server

**Scheduler**
- Decides which Node runs each Pod
- Considers: resource availability, constraints, affinity rules
- Like assigning tasks to workers based on capacity

**Controller Manager**
- Ensures desired state matches actual state
- "I want 3 replicas" → Controller ensures 3 are always running
- Handles: deployments, replication, endpoints, etc.

**etcd**
- Key-value database storing cluster state
- The "brain" remembering everything
- Critical: if etcd fails, cluster loses memory

---

**2. Worker Node Components**

**kubelet**
- Agent running on each Node
- Ensures containers are running in Pods
- Reports Node status to Control Plane
- Like a supervisor on each machine

**kube-proxy**
- Network proxy on each Node
- Handles networking rules
- Enables communication between Pods
- Load balances traffic

**Container Runtime**
- Actually runs containers (Docker, containerd, CRI-O)
- kubelet tells it what containers to run

---

#### Core Kubernetes Objects

**1. Pod** 🍃
- **Smallest deployable unit**
- Wraps one or more containers
- Containers in a Pod share network and storage
- Usually one container per Pod (best practice)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
spec:
  containers:
  - name: app
    image: fast-food-api:v1
    ports:
    - containerPort: 3000
```

**Analogy:** Pod = Apartment. Container = Person living in it.

---

**2. Node** 💻
- **Physical or virtual machine**
- Runs Pods
- Has kubelet, kube-proxy, container runtime
- Part of the cluster

**Analogy:** Node = Building with multiple apartments (Pods)

---

**3. Cluster** 🌐
- **Set of Nodes managed by Control Plane**
- Your entire Kubernetes environment
- Can span multiple data centers

**Analogy:** Cluster = Entire neighborhood with buildings (Nodes) and apartments (Pods)

---

### Part 3: Installing Kubernetes Tools (60 min)

#### Step 1: Install kubectl (Kubernetes CLI)

**Linux (Ubuntu/Debian):**
```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Make it executable
chmod +x kubectl

# Move to PATH
sudo mv kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

**Expected output:**
```
Client Version: v1.28.x
```

---

#### Step 2: Install Minikube (Local Kubernetes)

**What is Minikube?**
- Local Kubernetes cluster for development
- Runs in a VM or Docker container
- Single-node cluster (Control Plane + Worker in one)
- Perfect for learning!

**Linux installation:**
```bash
# Download Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Install
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify
minikube version
```

**Expected output:**
```
minikube version: v1.32.x
```

---

#### Step 3: Start Minikube

```bash
# Start Minikube (uses Docker driver by default)
minikube start

# This will:
# 1. Download Kubernetes components
# 2. Start a local cluster
# 3. Configure kubectl to use it
```

**Expected output:**
```
😄  minikube v1.32.0 on Ubuntu 22.04
✨  Automatically selected the docker driver
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🔥  Creating docker container (CPUs=2, Memory=4000MB) ...
🐳  Preparing Kubernetes v1.28.0 on Docker 24.0.7 ...
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster
```

---

#### Step 4: Verify Installation

```bash
# Check cluster status
minikube status
```

**Expected output:**
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

```bash
# Check cluster info
kubectl cluster-info
```

**Expected output:**
```
Kubernetes control plane is running at https://192.168.49.2:8443
CoreDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

```bash
# Check nodes
kubectl get nodes
```

**Expected output:**
```
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.28.0
```

🎉 **Success! Your Kubernetes cluster is running!**

---

## Afternoon Session (3-4 hours)

### Part 4: kubectl Basics (90 min)

#### Understanding kubectl Syntax

```
kubectl [command] [TYPE] [NAME] [flags]
```

**Examples:**
```bash
kubectl get pods                    # List all pods
kubectl describe pod my-app         # Show pod details
kubectl delete deployment my-app    # Delete deployment
kubectl logs my-app                 # Show pod logs
```

---

#### Essential kubectl Commands

**1. Get Resources**
```bash
# List resources
kubectl get pods                    # List pods
kubectl get services                # List services
kubectl get deployments             # List deployments
kubectl get all                     # List all resources

# Wide output (more info)
kubectl get pods -o wide

# Watch for changes
kubectl get pods --watch

# List from all namespaces
kubectl get pods --all-namespaces
kubectl get pods -A                 # Short version
```

---

**2. Describe Resources**
```bash
# Detailed information
kubectl describe pod <pod-name>
kubectl describe node minikube
kubectl describe service my-service

# Shows:
# - Configuration
# - Status
# - Events (very useful for debugging!)
```

---

**3. Create Resources**
```bash
# From YAML file
kubectl apply -f deployment.yaml

# From multiple files
kubectl apply -f deployment.yaml -f service.yaml

# From directory
kubectl apply -f ./k8s/

# Create from command line (not recommended for production)
kubectl run nginx --image=nginx
kubectl create deployment nginx --image=nginx
```

---

**4. Update Resources**
```bash
# Apply changes from YAML
kubectl apply -f deployment.yaml

# Edit resource directly (opens editor)
kubectl edit deployment my-app

# Scale deployment
kubectl scale deployment my-app --replicas=5
```

---

**5. Delete Resources**
```bash
# Delete resource
kubectl delete pod my-pod
kubectl delete deployment my-app

# Delete from file
kubectl delete -f deployment.yaml

# Delete all pods
kubectl delete pods --all

# Force delete (not recommended)
kubectl delete pod my-pod --force --grace-period=0
```

---

**6. Logs and Debugging**
```bash
# View logs
kubectl logs <pod-name>

# Follow logs (like tail -f)
kubectl logs -f <pod-name>

# Logs from specific container in pod
kubectl logs <pod-name> -c <container-name>

# Previous logs (if container restarted)
kubectl logs <pod-name> --previous
```

---

**7. Execute Commands in Pods**
```bash
# Run command in pod
kubectl exec <pod-name> -- ls /app

# Interactive shell
kubectl exec -it <pod-name> -- sh
kubectl exec -it <pod-name> -- bash

# Execute in specific container
kubectl exec -it <pod-name> -c <container-name> -- sh
```

---

**8. Port Forwarding**
```bash
# Forward local port to pod
kubectl port-forward pod/<pod-name> 3000:3000
kubectl port-forward service/<service-name> 3000:3000

# Access at http://localhost:3000
```

---

**9. Useful Aliases**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kga='kubectl get all'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias ke='kubectl exec -it'

# Use like:
k get pods
kgp -o wide
kl my-pod
```

---

### Part 5: Your First Kubernetes Deployment (90 min)

#### Exercise 1: Deploy NGINX

**Step 1: Create a Pod**

```bash
# Create nginx pod
kubectl run nginx --image=nginx --port=80

# Check pod status
kubectl get pods

# Watch pod creation
kubectl get pods --watch
```

**Expected output:**
```
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          10s
```

---

**Step 2: Inspect the Pod**

```bash
# Detailed information
kubectl describe pod nginx

# Check logs
kubectl logs nginx

# Execute command
kubectl exec nginx -- nginx -v
```

---

**Step 3: Access the Pod**

```bash
# Port forward to access locally
kubectl port-forward pod/nginx 8080:80

# Open browser to http://localhost:8080
# You should see "Welcome to nginx!"
```

Press Ctrl+C to stop port forwarding.

---

**Step 4: Clean Up**

```bash
# Delete pod
kubectl delete pod nginx

# Verify deletion
kubectl get pods
```

---

#### Exercise 2: Deploy Using YAML

**Step 1: Create Pod Manifest**

```bash
# Create k8s directory
mkdir -p ~/fast-food-api/k8s/exercises

# Create pod.yaml
cat > ~/fast-food-api/k8s/exercises/nginx-pod.yaml << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
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
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
EOF
```

---

**Step 2: Apply the Manifest**

```bash
# Deploy pod
kubectl apply -f ~/fast-food-api/k8s/exercises/nginx-pod.yaml

# Check pod
kubectl get pods
kubectl describe pod nginx-pod
```

---

**Step 3: Access the Pod**

```bash
# Get pod IP
kubectl get pod nginx-pod -o wide

# Port forward
kubectl port-forward pod/nginx-pod 8080:80

# Test
curl http://localhost:8080
```

---

**Step 4: View and Edit**

```bash
# View YAML from cluster
kubectl get pod nginx-pod -o yaml

# Edit live (opens editor)
kubectl edit pod nginx-pod

# Try changing image version or resources
```

---

**Step 5: Clean Up**

```bash
# Delete using file
kubectl delete -f ~/fast-food-api/k8s/exercises/nginx-pod.yaml

# Or delete directly
kubectl delete pod nginx-pod
```

---

#### Exercise 3: Deploy Fast-Food API to Kubernetes

**Step 1: Load Docker Image to Minikube**

```bash
# Build Docker image (if not already built)
cd ~/fast-food-api
docker build -t fast-food-api:v1 .

# Load image into Minikube
minikube image load fast-food-api:v1

# Verify image is available
minikube image ls | grep fast-food-api
```

---

**Step 2: Create Pod Manifest**

```yaml
# k8s/exercises/api-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: fast-food-api-pod
  labels:
    app: fast-food-api
spec:
  containers:
  - name: api
    image: fast-food-api:v1
    imagePullPolicy: Never  # Use local image
    ports:
    - containerPort: 3000
    env:
    - name: HOST_PORT
      value: "3000"
    - name: NODE_ENV
      value: "production"
    # Note: No DATABASE_URL yet - we'll add database in later days
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
```

---

**Step 3: Deploy the Pod**

```bash
# Apply manifest
kubectl apply -f k8s/exercises/api-pod.yaml

# Watch pod status
kubectl get pods --watch

# Check logs
kubectl logs fast-food-api-pod

# Describe pod (check events)
kubectl describe pod fast-food-api-pod
```

---

**Step 4: Test the API**

```bash
# Port forward
kubectl port-forward pod/fast-food-api-pod 3000:3000

# In another terminal, test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/categories

# View logs
kubectl logs -f fast-food-api-pod
```

---

**Step 5: Debug if Issues**

```bash
# Check pod status
kubectl get pod fast-food-api-pod

# If CrashLoopBackOff or Error:
kubectl logs fast-food-api-pod
kubectl logs fast-food-api-pod --previous  # Previous run logs
kubectl describe pod fast-food-api-pod      # Check events

# Enter pod shell (if running)
kubectl exec -it fast-food-api-pod -- sh

# Inside pod:
ls -la
env | grep -i node
node --version
```

---

### Part 6: Understanding Pod Lifecycle (30 min)

#### Pod Status Phases

```
Pending → ContainerCreating → Running → Succeeded/Failed
```

**Pending**
- Pod accepted but not scheduled yet
- Waiting for resources or image pull

**ContainerCreating**
- Pulling images
- Creating containers

**Running**
- At least one container running

**Succeeded**
- All containers completed successfully
- Won't restart (for batch jobs)

**Failed**
- All containers terminated, at least one failed

**CrashLoopBackOff**
- Container keeps crashing
- Kubernetes is backing off restarts

---

#### Restart Policies

```yaml
spec:
  restartPolicy: Always  # Default - always restart on failure
  restartPolicy: OnFailure  # Restart only on failure (exit code != 0)
  restartPolicy: Never  # Never restart
```

---

#### Health Checks

**Liveness Probe** - Is container alive?
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
```

**Readiness Probe** - Is container ready for traffic?
```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

**We'll add these in Day 9!**

---

## End of Day Review (30 min)

### Self-Assessment Questions

Answer without looking at notes:

1. **What is Kubernetes?**
   - Your answer: _______________

2. **What are the main Control Plane components?**
   - Your answer: _______________

3. **What is a Pod?**
   - Your answer: _______________

4. **What is the difference between a Pod and a Node?**
   - Your answer: _______________

5. **What does kubectl do?**
   - Your answer: _______________

6. **What is Minikube?**
   - Your answer: _______________

### Answers:
1. Container orchestration platform that automates deployment, scaling, and management
2. API Server, Scheduler, Controller Manager, etcd
3. Smallest deployable unit, wraps one or more containers
4. Pod = unit of deployment (containers). Node = machine running pods
5. Command-line tool to interact with Kubernetes clusters
6. Local Kubernetes cluster for development/learning

---

### Checklist for Day 8

- [ ] I understand what Kubernetes is and why it's used
- [ ] I can explain the K8s architecture
- [ ] kubectl and Minikube are installed and working
- [ ] I can execute basic kubectl commands
- [ ] I deployed my first pod
- [ ] I deployed fast-food-api to Kubernetes
- [ ] I understand Pod lifecycle

---

## Common Issues & Solutions

**Issue: Minikube won't start**
```bash
# Solution 1: Check Docker is running
docker ps

# Solution 2: Delete and restart
minikube delete
minikube start

# Solution 3: Use different driver
minikube start --driver=virtualbox
```

**Issue: Image not found in Minikube**
```bash
# Solution: Load image to Minikube
eval $(minikube docker-env)
docker build -t fast-food-api:v1 .
# OR
minikube image load fast-food-api:v1
```

**Issue: Can't access pod**
```bash
# Solution: Use port-forward
kubectl port-forward pod/<pod-name> 3000:3000
```

---

## Tomorrow's Preview: Deployments & Services

Tomorrow we'll learn:
- **Deployments** - How to manage multiple Pods
- **ReplicaSets** - Ensuring desired number of Pods
- **Services** - Exposing Pods to network traffic
- **Rolling updates** - Zero-downtime deployments

**Prep work (optional):** Think about how you'd run 3 copies of your API

---

## Additional Resources

### Documentation
- [Kubernetes Official Docs](https://kubernetes.io/docs/home/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)

### Videos
- 🎥 "Kubernetes Explained in 15 Minutes" - TechWorld with Nana
- 🎥 "Kubernetes Tutorial for Beginners" - FreeCodeCamp

### Interactive Learning
- [Play with Kubernetes](https://labs.play-with-k8s.com/)
- [Katacoda Kubernetes Playground](https://www.katacoda.com/courses/kubernetes)

---

**Excellent work today! You've taken your first steps into Kubernetes! Tomorrow we'll make our deployments production-ready! 🚀**
