# BOOMER System Diagrams

## Agent Communication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     BOOMER Agent Swarm Architecture                      │
└─────────────────────────────────────────────────────────────────────────┘

INPUT LAYER
┌──────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  File Watcher          REST API          Scheduled Jobs             │
│  (Chokidar)           (Express)          (BullMQ)                    │
│       │                   │                    │                      │
└───────┼───────────────────┼────────────────────┼──────────────────────┘
        │                   │                    │
        └───────────────────┴────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EVENT BUS (Redis Pub/Sub)                       │
└─────────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Vision     │    │  Condition   │    │   Market     │
│   Agent      │    │  Assessor    │    │Intelligence  │
│              │    │              │    │    Agent     │
│  Claude 3.5  │    │  Claude 3.5  │    │  Playwright  │
│   Sonnet     │    │   Sonnet     │    │   Scraper    │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                    ┌──────────────┐
                    │ Description  │
                    │  Optimizer   │
                    │              │
                    │ Claude 3.5   │
                    │  Sonnet      │
                    └──────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Listing Orchestrator (Saga)                        │
│                                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                   │
│  │   eBay     │  │  Facebook  │  │  Mercari   │                   │
│  │  Adapter   │  │  Adapter   │  │  Adapter   │                   │
│  └────────────┘  └────────────┘  └────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     eBay     │    │   Facebook   │    │   Mercari    │
│  Marketplace │    │  Marketplace │    │  Marketplace │
└──────────────┘    └──────────────┘    └──────────────┘

DATA LAYER
┌─────────────────────────────────────────────────────────────────────┐
│  PostgreSQL + pgvector  │  Redis Cache  │  S3 Image Storage        │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
┌────────┐
│  User  │
└───┬────┘
    │ 1. Drop image in folder
    ▼
┌────────────────┐
│ File Watcher   │
└───┬────────────┘
    │ 2. Emit 'new_image' event
    ▼
┌────────────────────────────────────────────────────────────────┐
│                    Event Bus (Redis)                            │
└───┬────────────────────────────────────────────────────────────┘
    │ 3. Distribute to agents
    │
    ├──────────────────────┬──────────────────────┬──────────────┐
    ▼                      ▼                      ▼              ▼
┌─────────┐          ┌─────────┐          ┌─────────┐    ┌─────────┐
│ Vision  │          │Condition│          │ Market  │    │Descriptn│
│ Agent   │──────────│Assessor │──────────│Intel    │────│Optimizer│
└─────────┘   4a.    └─────────┘   4b.    └─────────┘ 4c.└─────────┘
    │         Send       │         Send        │    Send    │
    │         product    │         condition   │    market  │
    │         data       │         data        │    data    │
    │                    │                     │            │
    └────────────────────┴─────────────────────┴────────────┘
                              │ 5. All data ready
                              ▼
                    ┌──────────────────┐
                    │    Orchestrator  │
                    │  (Saga Pattern)  │
                    └──────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
      ┌─────────┐       ┌─────────┐       ┌─────────┐
      │  eBay   │       │Facebook │       │ Mercari │
      │ Adapter │       │ Adapter │       │ Adapter │
      └─────────┘       └─────────┘       └─────────┘
            │                 │                 │
            │ 6. Create       │ 6. Create       │ 6. Create
            │    listing      │    listing      │    listing
            ▼                 ▼                 ▼
      ┌─────────┐       ┌─────────┐       ┌─────────┐
      │  eBay   │       │Facebook │       │ Mercari │
      │   API   │       │   API   │       │   API   │
      └─────────┘       └─────────┘       └─────────┘
            │                 │                 │
            └─────────────────┴─────────────────┘
                              │ 7. Return listing URLs
                              ▼
                    ┌──────────────────┐
                    │   Notification   │
                    │     Service      │
                    └──────────────────┘
                              │ 8. Notify user
                              ▼
                         ┌────────┐
                         │  User  │
                         └────────┘
```

## State Machine: Listing Lifecycle

```
                      ┌─────────┐
                      │ DROPPED │ (Image uploaded)
                      └────┬────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  ANALYZING   │ (Vision agent processing)
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
         ┌──────────┐          ┌──────────┐
         │ ANALYZED │          │  FAILED  │ (Vision failed)
         └────┬─────┘          └──────────┘
              │
              ▼
       ┌──────────────┐
       │ RESEARCHING  │ (Market intelligence + condition)
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │  OPTIMIZING  │ (Description generation)
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │   PENDING    │ (Ready for approval)
       └──────┬───────┘
              │
              ├───────────┐
              ▼           ▼
       ┌──────────┐  ┌──────────┐
       │PUBLISHING│  │ REJECTED │ (User rejected)
       └────┬─────┘  └──────────┘
            │
            ▼
       ┌──────────────┐
       │  PUBLISHED   │ (Live on platforms)
       └──────┬───────┘
              │
              ├────────────┬────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │  ACTIVE  │ │   SOLD   │ │ EXPIRED  │
       └──────────┘ └──────────┘ └──────────┘
```

## Error Handling Flow (Circuit Breaker)

```
┌────────────────────────────────────────────────────────┐
│                  Circuit Breaker State Machine          │
└────────────────────────────────────────────────────────┘

                        ┌─────────┐
                   ┌────│ CLOSED  │────┐
                   │    └─────────┘    │
                   │    All requests   │
                   │    go through     │
                   │                   │
        Success    │                   │  Failure count
        resets ────┘                   └─── reaches threshold
        counter                             (e.g., 5 failures)
                                                  │
                                                  ▼
                                          ┌───────────┐
                                          │   OPEN    │
                                          └─────┬─────┘
                                                │ All requests
                                                │ immediately fail
                                                │
                                    After timeout period
                                    (e.g., 60 seconds)
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │  HALF-OPEN    │
                                        └───────┬───────┘
                                                │ Test request
                                                │ goes through
                                                │
                            ┌───────────────────┼───────────────────┐
                            ▼                                       ▼
                       Success                                  Failure
                    (back to CLOSED)                      (back to OPEN)


Example: eBay API Circuit Breaker

Request → Check State
            │
            ├─ CLOSED → Execute request
            │            │
            │            ├─ Success → Reset failure counter
            │            └─ Failure → Increment failure counter
            │                         │
            │                         └─ If count >= 5 → OPEN state
            │
            ├─ OPEN → Reject immediately with error
            │          "eBay service unavailable"
            │
            └─ HALF-OPEN → Execute test request
                           │
                           ├─ Success → CLOSED state
                           └─ Failure → OPEN state
```

## Queue Architecture (BullMQ)

```
┌────────────────────────────────────────────────────────────────────┐
│                      Job Queue Architecture                         │
└────────────────────────────────────────────────────────────────────┘

                           ┌─────────────┐
                           │   Producer  │
                           │  (API/Event)│
                           └──────┬──────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
            ┌──────────┐  ┌──────────┐  ┌──────────┐
            │  Queue:  │  │  Queue:  │  │  Queue:  │
            │  Vision  │  │  Market  │  │ Listing  │
            │          │  │          │  │          │
            │ Priority:│  │ Priority:│  │ Priority:│
            │ • High   │  │ • High   │  │ • High   │
            │ • Med    │  │ • Med    │  │ • Med    │
            │ • Low    │  │ • Low    │  │ • Low    │
            └──────────┘  └──────────┘  └──────────┘
                    │             │             │
                    ▼             ▼             ▼
            ┌──────────┐  ┌──────────┐  ┌──────────┐
            │ Worker 1 │  │ Worker 1 │  │ Worker 1 │
            ├──────────┤  ├──────────┤  ├──────────┤
            │ Worker 2 │  │ Worker 2 │  │ Worker 2 │
            ├──────────┤  ├──────────┤  ├──────────┤
            │ Worker 3 │  │ Worker 3 │  │ Worker 3 │
            └──────────┘  └──────────┘  └──────────┘
                    │             │             │
                    └─────────────┼─────────────┘
                                  ▼
                          ┌──────────────┐
                          │    Redis     │
                          │  (Storage)   │
                          └──────────────┘

Job Lifecycle:
1. Job created → Queued (waiting)
2. Worker picks up → Active (processing)
3. Processing completes → Completed (done)
4. On failure → Failed (with retry logic)
   │
   └─ Retry #1 (after 5s delay)
      │
      └─ Retry #2 (after 25s delay, exponential backoff)
         │
         └─ Retry #3 (after 125s delay)
            │
            └─ Max retries → Dead Letter Queue (manual intervention)
```

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    Database Entity Relationships                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│    PRODUCTS      │
│ ───────────────  │
│ • id (PK)        │
│ • sku            │
│ • product_name   │
│ • brand          │
│ • category       │
│ • embedding      │ ←────────────────┐
│   (vector)       │                   │ Vector similarity
└────────┬─────────┘                   │ search for
         │                             │ similar products
         │ 1:1                         │
         ▼                             │
┌──────────────────┐                   │
│PRODUCT_CONDITIONS│                   │
│ ───────────────  │                   │
│ • id (PK)        │                   │
│ • product_id(FK) │                   │
│ • overall_grade  │                   │
│ • defects (JSON) │                   │
└──────────────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│    LISTINGS      │                   │
│ ───────────────  │                   │
│ • id (PK)        │                   │
│ • product_id(FK) │                   │
│ • platform       │                   │
│ • listing_url    │                   │
│ • price          │                   │
│ • status         │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│ANALYTICS_EVENTS  │                   │
│ ───────────────  │                   │
│ • id (PK)        │                   │
│ • event_type     │                   │
│ • product_id(FK) │                   │
│ • listing_id(FK) │                   │
│ • event_data     │                   │
└──────────────────┘                   │
                                        │
┌──────────────────┐                   │
│  MARKET_DATA     │                   │
│ ───────────────  │                   │
│ • id (PK)        │                   │
│ • product_hash   │ ──────────────────┘
│ • platform       │   Cached pricing
│ • pricing_stats  │   data indexed by
│ • expires_at     │   product hash
└──────────────────┘

Indexes:
• products.embedding (ivfflat for vector search)
• market_data(product_hash, platform)
• listings(product_id, platform, status)
• analytics_events(event_type, created_at)
```

## Caching Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                   Multi-Layer Cache Strategy                    │
└────────────────────────────────────────────────────────────────┘

Request Flow:

Client Request
      │
      ▼
┌──────────────────┐
│   L1: Memory     │  • In-process cache (Node.js Map)
│   (100 MB)       │  • TTL: 5 minutes
│   Hit rate: 30%  │  • Fastest (0.1ms)
└────────┬─────────┘
         │ Cache miss
         ▼
┌──────────────────┐
│   L2: Redis      │  • Distributed cache
│   (10 GB)        │  • TTL: 24 hours
│   Hit rate: 60%  │  • Fast (1-5ms)
└────────┬─────────┘
         │ Cache miss
         ▼
┌──────────────────┐
│ L3: PostgreSQL   │  • Persistent storage
│   (Unlimited)    │  • TTL: 7 days
│   Hit rate: 90%  │  • Slower (10-50ms)
└────────┬─────────┘
         │ Cache miss
         ▼
┌──────────────────┐
│  Origin Service  │  • Execute expensive operation
│  (Vision/Market) │  • Playwright scraping
│                  │  • Claude API call
└────────┬─────────┘
         │ Result
         ▼
    Write-through:
    Store in L3 → L2 → L1

Cache Key Strategy:
• Vision: `vision:${image_hash}:${model_version}`
• Market: `market:${product_hash}:${platform}:${condition}`
• Description: `desc:${product_id}:${platform}:${version}`

Eviction Policy:
• L1: LRU (Least Recently Used)
• L2: TTL-based expiration
• L3: Scheduled cleanup (daily job)
```

## Monitoring & Alerting Flow

```
┌────────────────────────────────────────────────────────────────┐
│              Observability Stack (3 Pillars)                    │
└────────────────────────────────────────────────────────────────┘

METRICS (Prometheus)
┌──────────────────────────────────────────────────────────────┐
│  Agent Services                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │ Vision  │  │ Market  │  │Listing  │                      │
│  └────┬────┘  └────┬────┘  └────┬────┘                      │
│       │            │            │                             │
│       └────────────┴────────────┘                            │
│                    │ /metrics endpoint                        │
│                    ▼                                          │
│            ┌──────────────┐                                   │
│            │  Prometheus  │ ← scrape every 15s               │
│            │   Server     │                                   │
│            └──────┬───────┘                                   │
│                   │ Query                                     │
│                   ▼                                           │
│            ┌──────────────┐                                   │
│            │   Grafana    │ ← Visualization                  │
│            │  Dashboard   │                                   │
│            └──────────────┘                                   │
└──────────────────────────────────────────────────────────────┘

LOGS (Structured JSON)
┌──────────────────────────────────────────────────────────────┐
│  All Services → Winston Logger                               │
│                       │                                       │
│                       ▼                                       │
│              ┌──────────────┐                                │
│              │  Loki        │ ← Log aggregation              │
│              │  (LogQL)     │                                │
│              └──────┬───────┘                                │
│                     │ Query                                   │
│                     ▼                                         │
│              ┌──────────────┐                                │
│              │   Grafana    │ ← Log exploration              │
│              └──────────────┘                                │
└──────────────────────────────────────────────────────────────┘

TRACES (OpenTelemetry)
┌──────────────────────────────────────────────────────────────┐
│  Request → Vision → Market → Description → Listing           │
│               │       │          │            │              │
│               └───────┴──────────┴────────────┘              │
│                           │ Trace context                     │
│                           ▼                                   │
│                   ┌──────────────┐                           │
│                   │   Jaeger     │ ← Distributed tracing     │
│                   │   Backend    │                           │
│                   └──────┬───────┘                           │
│                          │ Query                              │
│                          ▼                                    │
│                   ┌──────────────┐                           │
│                   │  Jaeger UI   │ ← Trace visualization     │
│                   └──────────────┘                           │
└──────────────────────────────────────────────────────────────┘

ALERTING FLOW
┌──────────────────────────────────────────────────────────────┐
│  Prometheus Alert Rules                                       │
│  ┌────────────────────────────────────────────────┐          │
│  │ • High error rate (>5%)                        │          │
│  │ • Slow response time (p95 > 10s)               │          │
│  │ • Low cache hit rate (<40%)                    │          │
│  │ • Service down (uptime < 99%)                  │          │
│  └────────────────┬───────────────────────────────┘          │
│                   │ Alert triggered                           │
│                   ▼                                           │
│            ┌──────────────┐                                   │
│            │ Alertmanager │                                   │
│            └──────┬───────┘                                   │
│                   │                                           │
│        ┌──────────┼──────────┐                               │
│        ▼          ▼          ▼                                │
│   ┌────────┐ ┌────────┐ ┌────────┐                          │
│   │ Email  │ │ Slack  │ │PagerDuty│                         │
│   └────────┘ └────────┘ └────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Kubernetes)

```
┌────────────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster                            │
└────────────────────────────────────────────────────────────────┘

                     ┌─────────────────┐
                     │  Load Balancer  │
                     │   (External)    │
                     └────────┬────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │      Ingress Controller         │
            │       (NGINX/Traefik)           │
            └───┬───────────────┬─────────┬───┘
                │               │         │
        ┌───────▼──────┐ ┌─────▼────┐ ┌─▼────────┐
        │ API Gateway  │ │  WebApp  │ │ Metrics  │
        │  Service     │ │  Service │ │ Service  │
        └───┬──────────┘ └──────────┘ └──────────┘
            │
    ┌───────┼───────┬────────┬────────┬────────┐
    ▼       ▼       ▼        ▼        ▼        ▼
┌────────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
│ Vision ││Condtn││Market││Descpt││ List ││ Notif│
│ Agent  ││Assssr││Intel ││Optim ││Orchst││Service│
│        ││      ││      ││      ││      ││      │
│ Pod ×3 ││Pod×2 ││Pod×5 ││Pod×2 ││Pod×3 ││Pod×2 │
└────────┘└──────┘└──────┘└──────┘└──────┘└──────┘
    │       │       │        │        │        │
    └───────┴───────┴────────┴────────┴────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
┌──────────────┐┌──────────────┐┌──────────────┐
│ PostgreSQL   ││    Redis     ││     S3       │
│   StatefulSet││  StatefulSet ││   (Images)   │
│              ││              ││              │
│ Primary +    ││ Cluster      ││ MinIO /      │
│ Replicas ×2  ││ (3 nodes)    ││ External     │
└──────────────┘└──────────────┘└──────────────┘

Namespace Organization:
• boomer-production
• boomer-staging
• boomer-monitoring

Resource Allocation:
┌────────────────┬───────────┬───────────┐
│ Service        │ CPU       │ Memory    │
├────────────────┼───────────┼───────────┤
│ Vision Agent   │ 1-2 cores │ 2-4 GB    │
│ Market Intel   │ 0.5-1 core│ 1-2 GB    │
│ Listing Orchst │ 0.5-1 core│ 1-2 GB    │
│ PostgreSQL     │ 2-4 cores │ 8-16 GB   │
│ Redis          │ 1-2 cores │ 4-8 GB    │
└────────────────┴───────────┴───────────┘

Scaling Strategy:
• HPA (Horizontal Pod Autoscaler)
  - Scale on CPU >70%
  - Scale on Memory >80%
  - Scale on custom metrics (queue depth)

• VPA (Vertical Pod Autoscaler)
  - Adjust resource requests/limits

• Cluster Autoscaler
  - Add/remove nodes based on demand
```

## Security Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Security Layers                              │
└────────────────────────────────────────────────────────────────┘

LAYER 1: Network Security
┌──────────────────────────────────────────────────────────────┐
│  Firewall Rules                                               │
│  • Allow: HTTPS (443), API (3000)                            │
│  • Deny: All other inbound traffic                           │
│                                                               │
│  DDoS Protection                                              │
│  • Cloudflare / AWS Shield                                    │
│  • Rate limiting: 100 req/min per IP                         │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
LAYER 2: Application Security
┌──────────────────────────────────────────────────────────────┐
│  API Gateway                                                  │
│  ┌────────────────────────────────────────────────┐          │
│  │ • Authentication (JWT)                         │          │
│  │ • Authorization (RBAC)                         │          │
│  │ • Input validation (Zod schemas)               │          │
│  │ • CORS policy enforcement                      │          │
│  └────────────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
LAYER 3: Data Security
┌──────────────────────────────────────────────────────────────┐
│  Encryption                                                   │
│  • In-transit: TLS 1.3 (all connections)                     │
│  • At-rest: AES-256-GCM (credentials, PII)                   │
│                                                               │
│  Data Access Control                                          │
│  • Row-level security (RLS) in PostgreSQL                    │
│  • Encrypted environment variables (Vault)                    │
│  • API key rotation (90 days)                                │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
LAYER 4: Monitoring & Audit
┌──────────────────────────────────────────────────────────────┐
│  Security Monitoring                                          │
│  • Failed authentication attempts                             │
│  • Unusual API usage patterns                                 │
│  • Data access audit logs                                     │
│  • Intrusion detection (Falco)                               │
└──────────────────────────────────────────────────────────────┘

Authentication Flow:
User → Login with credentials
         │
         ▼
    Verify credentials (bcrypt hash)
         │
         ▼
    Generate JWT token (15min expiry)
         │
         ▼
    Return: { accessToken, refreshToken }
         │
         ▼
    Subsequent requests include: Authorization: Bearer <token>
         │
         ▼
    API Gateway validates token → Allow/Deny
```

---

## Performance Optimization Patterns

```
┌────────────────────────────────────────────────────────────────┐
│              Performance Optimization Strategies                │
└────────────────────────────────────────────────────────────────┘

1. REQUEST BATCHING
   Instead of:
   for (const item of items) {
     await processItem(item);  // Sequential, slow
   }

   Use:
   await Promise.all(
     items.map(item => processItem(item))  // Parallel, fast
   );

2. CONNECTION POOLING
   Bad:
   for (const query of queries) {
     const client = await pg.connect();  // New connection each time
     await client.query(query);
     await client.end();
   }

   Good:
   const pool = new Pool({ max: 20 });
   for (const query of queries) {
     await pool.query(query);  // Reuse connections
   }

3. LAZY LOADING
   Bad:
   const allProducts = await db.query('SELECT * FROM products');
   // Load everything into memory

   Good:
   async function* getProducts() {
     const cursor = db.query('SELECT * FROM products');
     for await (const row of cursor) {
       yield row;  // Stream results
     }
   }

4. DEBOUNCING / THROTTLING
   Bad:
   fileWatcher.on('change', async (file) => {
     await processImage(file);  // Runs on every file change
   });

   Good:
   const debouncedProcess = debounce(processImage, 2000);
   fileWatcher.on('change', (file) => {
     debouncedProcess(file);  // Runs once after 2s of no changes
   });

5. RESULT CACHING
   Bad:
   app.get('/api/products/:id', async (req, res) => {
     const product = await db.query(
       'SELECT * FROM products WHERE id = $1',
       [req.params.id]
     );  // Query DB every time
     res.json(product);
   });

   Good:
   app.get('/api/products/:id', async (req, res) => {
     const cacheKey = `product:${req.params.id}`;
     let product = await redis.get(cacheKey);

     if (!product) {
       product = await db.query(...);
       await redis.set(cacheKey, JSON.stringify(product), 'EX', 3600);
     }

     res.json(JSON.parse(product));
   });
```

---

## Disaster Recovery Plan

```
┌────────────────────────────────────────────────────────────────┐
│               Disaster Recovery Strategy                        │
└────────────────────────────────────────────────────────────────┘

BACKUP STRATEGY
┌──────────────────────────────────────────────────────────────┐
│  PostgreSQL                                                   │
│  • Full backup: Daily @ 2 AM UTC                             │
│  • Incremental backup: Every 6 hours                         │
│  • WAL archiving: Continuous                                  │
│  • Retention: 30 days                                         │
│  • Storage: S3 with versioning                               │
│                                                               │
│  Redis                                                        │
│  • RDB snapshot: Every hour                                   │
│  • AOF (Append-Only File): Continuous                        │
│  • Retention: 7 days                                          │
│                                                               │
│  Images (S3)                                                  │
│  • Cross-region replication: Enabled                         │
│  • Versioning: Enabled                                        │
│  • Lifecycle policy: Archive to Glacier after 90 days        │
└──────────────────────────────────────────────────────────────┘

RECOVERY TIME OBJECTIVES (RTO)
┌──────────────────────────────────────────────────────────────┐
│  Scenario                    │ RTO      │ RPO               │
│ ──────────────────────────── │ ──────── │ ───────────────── │
│  Single service failure      │ < 5 min  │ 0 (no data loss)  │
│  Database corruption         │ < 1 hour │ < 6 hours         │
│  Full system failure         │ < 4 hours│ < 24 hours        │
│  Catastrophic failure        │ < 24 hrs │ < 48 hours        │
└──────────────────────────────────────────────────────────────┘

RECOVERY PROCEDURES
1. Service Failure (Pod crash)
   → Kubernetes auto-restarts pod
   → Health checks fail → Traffic redirected
   → New pod becomes healthy → Traffic resumed
   → Total downtime: <5 minutes

2. Database Failure
   → Detect failure (health check)
   → Promote standby replica to primary
   → Update connection strings
   → Resume operations
   → Restore from backup if needed
   → Total downtime: <1 hour

3. Region Failure
   → DNS failover to backup region
   → Restore database from S3 backup
   → Redeploy services in backup region
   → Resume operations
   → Total downtime: <4 hours

DISASTER RECOVERY TESTING
• Monthly: Simulate service failures
• Quarterly: Full database restore test
• Annually: Complete region failover drill
```
