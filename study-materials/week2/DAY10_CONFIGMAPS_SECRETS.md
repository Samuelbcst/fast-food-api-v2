# Day 10: ConfigMaps & Secrets

## Learning Objectives
By the end of today, you will:
- ✅ Understand ConfigMaps for configuration management
- ✅ Understand Secrets for sensitive data
- ✅ Create and use ConfigMaps
- ✅ Create and use Secrets securely
- ✅ Deploy PostgreSQL to Kubernetes
- ✅ Connect fast-food-api to database using Secrets

---

## Morning Session (3-4 hours)

### Part 1: The Configuration Problem (30 min)

#### Anti-Pattern: Hardcoded Configuration

```yaml
# ❌ BAD: Configuration hardcoded in Deployment
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: api
        image: fast-food-api:v1
        env:
        - name: DATABASE_URL
          value: "postgresql://admin:password123@postgres:5432/mydb"
        - name: HOST_PORT
          value: "3000"
        - name: API_KEY
          value: "super-secret-key-12345"
```

**Problems:**
- ❌ Secrets exposed in YAML (committed to Git!)
- ❌ Can't change config without redeploying
- ❌ Same config for dev/staging/prod
- ❌ Hard to manage
- ❌ Security nightmare

---

#### The Kubernetes Solution

**ConfigMaps** → Non-sensitive configuration
```
- HOST_PORT
- NODE_ENV
- Feature flags
- Application settings
```

**Secrets** → Sensitive data
```
- Database passwords
- API keys
- Certificates
- Authentication tokens
```

**Benefits:**
- ✅ Separate config from code
- ✅ Update config without rebuilding images
- ✅ Different configs for different environments
- ✅ Secrets are base64 encoded (better than plaintext)
- ✅ Access control via RBAC

---

### Part 2: ConfigMaps Deep Dive (60 min)

#### What is a ConfigMap?

**ConfigMap** = Key-value pairs for non-sensitive configuration

**Storage options:**
1. Literal values
2. Files
3. Directories

**Usage options:**
1. Environment variables
2. Command-line arguments
3. Files in volumes

---

#### Creating ConfigMaps

**Method 1: From Literal Values**

```bash
kubectl create configmap app-config \
  --from-literal=HOST_PORT=3000 \
  --from-literal=NODE_ENV=production \
  --from-literal=LOG_LEVEL=info
```

**View:**
```bash
kubectl get configmap app-config -o yaml
```

**Output:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  HOST_PORT: "3000"
  NODE_ENV: "production"
  LOG_LEVEL: "info"
```

---

**Method 2: From File**

```bash
# Create config file
cat > app.properties << EOF
HOST_PORT=3000
NODE_ENV=production
LOG_LEVEL=info
MAX_CONNECTIONS=100
EOF

# Create ConfigMap from file
kubectl create configmap app-config --from-file=app.properties
```

---

**Method 3: From YAML Manifest (Recommended)**

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fast-food-api-config
  labels:
    app: fast-food-api
data:
  # Application configuration
  HOST_PORT: "3000"
  NODE_ENV: "production"
  LOG_LEVEL: "info"

  # Feature flags
  ENABLE_SWAGGER: "true"
  ENABLE_CORS: "true"

  # Application settings
  MAX_CONNECTIONS: "100"
  TIMEOUT: "30000"
```

```bash
kubectl apply -f k8s/configmap.yaml
```

---

#### Using ConfigMaps in Pods

**Method 1: Environment Variables (All Keys)**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-pod
spec:
  containers:
  - name: api
    image: fast-food-api:v1
    envFrom:
    - configMapRef:
        name: fast-food-api-config
    # All ConfigMap keys become env vars!
```

---

**Method 2: Environment Variables (Specific Keys)**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-pod
spec:
  containers:
  - name: api
    image: fast-food-api:v1
    env:
    - name: HOST_PORT
      valueFrom:
        configMapKeyRef:
          name: fast-food-api-config
          key: HOST_PORT
    - name: NODE_ENV
      valueFrom:
        configMapKeyRef:
          name: fast-food-api-config
          key: NODE_ENV
```

---

**Method 3: Volume Mount (Files)**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-pod
spec:
  containers:
  - name: api
    image: fast-food-api:v1
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: fast-food-api-config
```

Files will appear at `/etc/config/HOST_PORT`, `/etc/config/NODE_ENV`, etc.

---

#### Exercise 1: Create and Use ConfigMap

**Step 1: Create ConfigMap**

```yaml
# k8s/fast-food-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fast-food-api-config
data:
  HOST_PORT: "3000"
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  ENABLE_SWAGGER: "true"
```

```bash
kubectl apply -f k8s/fast-food-configmap.yaml
kubectl get configmap fast-food-api-config
kubectl describe configmap fast-food-api-config
```

---

**Step 2: Update Deployment to Use ConfigMap**

```yaml
# k8s/api-deployment.yaml (updated)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fast-food-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fast-food-api
  template:
    metadata:
      labels:
        app: fast-food-api
    spec:
      containers:
      - name: api
        image: fast-food-api:v1
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: fast-food-api-config
        # Or specific keys:
        # env:
        # - name: HOST_PORT
        #   valueFrom:
        #     configMapKeyRef:
        #       name: fast-food-api-config
        #       key: HOST_PORT
```

```bash
kubectl apply -f k8s/api-deployment.yaml
```

---

**Step 3: Verify Environment Variables**

```bash
# Get a pod name
kubectl get pods -l app=fast-food-api

# Check env vars
kubectl exec <pod-name> -- env | grep -E 'HOST_PORT|NODE_ENV|LOG_LEVEL'
```

---

### Part 3: Secrets Deep Dive (60 min)

#### What is a Secret?

**Secret** = Base64-encoded sensitive data

**Types of Secrets:**
1. **Opaque** - Arbitrary user data (most common)
2. **kubernetes.io/service-account-token** - Service account token
3. **kubernetes.io/dockerconfigjson** - Docker registry credentials
4. **kubernetes.io/tls** - TLS certificates

---

#### Creating Secrets

**Method 1: From Literal Values**

```bash
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=super-secret-password
```

**View:**
```bash
kubectl get secret db-secret -o yaml
```

**Output:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=           # base64 encoded
  password: c3VwZXItc2VjcmV0LXBhc3N3b3Jk  # base64 encoded
```

**Decode:**
```bash
echo "YWRtaW4=" | base64 -d
# Output: admin
```

---

**Method 2: From File**

```bash
# Create secret file
echo -n "super-secret" > ./password.txt

# Create secret from file
kubectl create secret generic api-secret --from-file=password=./password.txt

# Delete file
rm ./password.txt
```

---

**Method 3: From YAML (Recommended for version control)**

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: fast-food-db-secret
type: Opaque
data:
  # Base64 encoded values
  POSTGRES_USER: cG9zdGdyZXM=       # postgres
  POSTGRES_PASSWORD: cG9zdGdyZXM=   # postgres
  POSTGRES_DB: ZmFzdGZvb2Q=         # fastfood
stringData:
  # Plain text (K8s will encode)
  # Only for convenience, still shows in YAML!
  DATABASE_URL: "postgresql://postgres:postgres@postgres-service:5432/fastfood"
```

**Generate base64:**
```bash
echo -n "postgres" | base64
# Output: cG9zdGdyZXM=

echo -n "fastfood" | base64
# Output: ZmFzdGZvb2Q=
```

**Apply:**
```bash
kubectl apply -f k8s/secret.yaml
```

---

#### 🔒 Security Best Practices

**DO ✅:**
- Use Secrets for sensitive data
- Limit access with RBAC
- Use external secret managers (Vault, AWS Secrets Manager) in production
- Encrypt etcd at rest
- Rotate secrets regularly

**DON'T ❌:**
- Commit secrets to Git (even base64!)
- Use Secrets for non-sensitive data
- Log secret values
- Print secrets in commands

**For Git:**
```bash
# Add to .gitignore
echo "k8s/secret.yaml" >> .gitignore

# Or use external secret management
# Or use sealed-secrets, SOPS, etc.
```

---

#### Using Secrets in Pods

**Method 1: Environment Variables (All Keys)**

```yaml
spec:
  containers:
  - name: api
    envFrom:
    - secretRef:
        name: db-secret
```

---

**Method 2: Environment Variables (Specific Keys)**

```yaml
spec:
  containers:
  - name: api
    env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: fast-food-db-secret
          key: DATABASE_URL
```

---

**Method 3: Volume Mount (Files)**

```yaml
spec:
  containers:
  - name: api
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-secret
```

---

## Afternoon Session (3-4 hours)

### Part 4: Deploy PostgreSQL to Kubernetes (90 min)

#### PostgreSQL Deployment Architecture

```
┌────────────────────────────────────────┐
│  PersistentVolume (PV)                 │
│  Storage: 1Gi                          │
└──────────────┬─────────────────────────┘
               │ bound to
┌──────────────▼─────────────────────────┐
│  PersistentVolumeClaim (PVC)           │
│  Requests: 1Gi storage                 │
└──────────────┬─────────────────────────┘
               │ mounted in
┌──────────────▼─────────────────────────┐
│  PostgreSQL Deployment                 │
│  ┌──────────────────────────────────┐  │
│  │  Pod: Postgres Container         │  │
│  │  - Uses Secret for credentials   │  │
│  │  - Mounts PVC for data           │  │
│  └──────────────────────────────────┘  │
└──────────────┬─────────────────────────┘
               │ exposed by
┌──────────────▼─────────────────────────┐
│  Service (ClusterIP)                   │
│  postgres-service:5432                 │
└────────────────────────────────────────┘
```

---

#### Step 1: Create Secret for Postgres

```yaml
# k8s/postgres-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
stringData:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_DB: fastfood
```

```bash
kubectl apply -f k8s/postgres-secret.yaml
```

---

#### Step 2: Create PersistentVolumeClaim

```yaml
# k8s/postgres-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

```bash
kubectl apply -f k8s/postgres-pvc.yaml
kubectl get pvc
```

---

#### Step 3: Create Postgres Deployment

```yaml
# k8s/postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  replicas: 1  # Database should have only 1 replica
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14-alpine
        ports:
        - containerPort: 5432
          name: postgres
        envFrom:
        - secretRef:
            name: postgres-secret
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
          subPath: postgres  # Avoid permission issues
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 10
          periodSeconds: 5
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl get pods -l app=postgres
```

---

#### Step 4: Create Postgres Service

```yaml
# k8s/postgres-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  labels:
    app: postgres
spec:
  type: ClusterIP
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
    protocol: TCP
    name: postgres
```

```bash
kubectl apply -f k8s/postgres-service.yaml
kubectl get service postgres-service
```

---

#### Step 5: Test Database Connection

```bash
# Create test pod
kubectl run psql-test --image=postgres:14-alpine --rm -it --restart=Never -- sh

# Inside pod, connect to database
psql -h postgres-service -U postgres -d fastfood

# Enter password: postgres

# Test SQL
\dt  # List tables (empty for now)
\q   # Quit

exit
```

---

### Part 5: Connect API to Database (60 min)

#### Step 1: Update API Secret with DATABASE_URL

```yaml
# k8s/api-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: fast-food-api-secret
type: Opaque
stringData:
  DATABASE_URL: "postgresql://postgres:postgres@postgres-service:5432/fastfood"
```

```bash
kubectl apply -f k8s/api-secret.yaml
```

---

#### Step 2: Update API Deployment

```yaml
# k8s/api-deployment.yaml (updated)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fast-food-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fast-food-api
  template:
    metadata:
      labels:
        app: fast-food-api
    spec:
      initContainers:
      # Run migrations before starting API
      - name: migrations
        image: fast-food-api:v1
        imagePullPolicy: Never
        command: ['npx', 'prisma', 'migrate', 'deploy']
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: fast-food-api-secret
              key: DATABASE_URL
      containers:
      - name: api
        image: fast-food-api:v1
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: fast-food-api-config
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: fast-food-api-secret
              key: DATABASE_URL
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
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

---

#### Step 3: Deploy Updated API

```bash
# Apply updated deployment
kubectl apply -f k8s/api-deployment.yaml

# Watch rollout
kubectl rollout status deployment/fast-food-api

# Check logs
kubectl logs -f deployment/fast-food-api

# Test API
kubectl port-forward service/fast-food-api-service 3000:3000

# In another terminal:
curl http://localhost:3000/api/v1/categories
```

---

#### Step 4: Verify Database Connection

```bash
# Create a category via API
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Lanche", "description": "Sandwiches"}'

# List categories
curl http://localhost:3000/api/v1/categories

# Connect to database and verify
kubectl exec -it deployment/postgres -- psql -U postgres -d fastfood

# In psql:
SELECT * FROM categories;
\q
```

---

### Part 6: Configuration Management Best Practices (30 min)

#### Organizing ConfigMaps and Secrets

**Structure:**
```
k8s/
├── configmap.yaml          # Application config
├── secret.yaml             # Application secrets (gitignored)
├── postgres-secret.yaml    # Database secrets (gitignored)
├── postgres-pvc.yaml       # Storage
├── postgres-deployment.yaml
├── postgres-service.yaml
├── api-deployment.yaml
└── api-service.yaml
```

---

#### Environment-Specific Configurations

**Development:**
```yaml
# k8s/dev/configmap.yaml
data:
  NODE_ENV: "development"
  LOG_LEVEL: "debug"
  ENABLE_SWAGGER: "true"
```

**Production:**
```yaml
# k8s/prod/configmap.yaml
data:
  NODE_ENV: "production"
  LOG_LEVEL: "warn"
  ENABLE_SWAGGER: "false"
```

---

#### Using Kustomize (Advanced)

```yaml
# k8s/base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
- configmap.yaml

# k8s/overlays/dev/kustomization.yaml
bases:
- ../../base
patchesStrategicMerge:
- configmap-patch.yaml
```

---

## End of Day Review (30 min)

### Self-Assessment Questions

1. **What is the difference between ConfigMap and Secret?**
2. **How do you create a Secret from command line?**
3. **What are 3 ways to use ConfigMaps in Pods?**
4. **Why use PersistentVolumeClaim for databases?**
5. **What is an init container?**

### Answers:
1. ConfigMap = non-sensitive config. Secret = sensitive data (base64 encoded)
2. `kubectl create secret generic <name> --from-literal=key=value`
3. envFrom, env with valueFrom, volume mount
4. To persist data beyond pod lifecycle (database data survives pod restart)
5. Container that runs before main containers, used for setup tasks (e.g., migrations)

---

### Checklist for Day 10

- [ ] I understand ConfigMaps and when to use them
- [ ] I understand Secrets and security best practices
- [ ] I created ConfigMaps and Secrets
- [ ] I deployed PostgreSQL to Kubernetes
- [ ] I connected API to database using Secrets
- [ ] API is working with database in K8s

---

## Tomorrow: Horizontal Pod Autoscaler (HPA)

Tomorrow we'll learn:
- Auto-scaling based on metrics
- Metrics Server installation
- HPA configuration
- Load testing to trigger scaling

**Prep:** Think about when you'd want to scale your API (CPU, memory, request rate)

---

**Excellent work! Your application now has proper configuration management and database! 🎉🔒**
