# BOOMER Testing Strategy

## Testing Philosophy

**Quality Gates**: Every layer has automated validation before promotion
**Shift-Left**: Catch issues early in development cycle
**Confidence**: 85%+ code coverage, 95%+ critical path coverage
**Performance**: Load testing validates scalability targets

---

## Test Pyramid

```
                    ┌─────────────┐
                    │    E2E      │  5-10% of tests
                    │  (Cypress)  │  Full user workflows
                    └─────────────┘  Multi-platform integration
                  ┌───────────────────┐
                  │   Integration     │  20-30% of tests
                  │   (Jest+Docker)   │  Agent communication
                  └───────────────────┘  API contracts
              ┌───────────────────────────┐
              │      Unit Tests           │  60-75% of tests
              │   (Jest+TypeScript)       │  Individual functions
              └───────────────────────────┘  Business logic
```

---

## Unit Tests

### Coverage Targets

| Layer | Target | Critical Paths |
|-------|--------|----------------|
| **Business Logic** | 90%+ | 95%+ |
| **Agent Functions** | 85%+ | 95%+ |
| **Utils/Helpers** | 95%+ | 100% |
| **Type Guards** | 100% | 100% |

### Test Structure (AAA Pattern)

```typescript
describe('VisionAgent', () => {
  describe('analyzeProduct', () => {
    it('should identify iPhone 13 Pro with high confidence', async () => {
      // ARRANGE
      const mockImage = await fs.readFile('test/fixtures/iphone-13-pro.jpg');
      const agent = new VisionAgent({ apiKey: 'test-key' });

      // ACT
      const result = await agent.analyzeProduct(mockImage);

      // ASSERT
      expect(result.productIdentification.name).toContain('iPhone 13 Pro');
      expect(result.productIdentification.brand).toBe('Apple');
      expect(result.productIdentification.confidence).toBeGreaterThan(0.85);
      expect(result.attributes.color).toBeDefined();
    });

    it('should handle corrupted image gracefully', async () => {
      const corruptedImage = Buffer.from('not-an-image');
      const agent = new VisionAgent({ apiKey: 'test-key' });

      await expect(agent.analyzeProduct(corruptedImage))
        .rejects.toThrow('Invalid image format');
    });

    it('should return low confidence for unclear images', async () => {
      const blurryImage = await fs.readFile('test/fixtures/blurry.jpg');
      const agent = new VisionAgent({ apiKey: 'test-key' });

      const result = await agent.analyzeProduct(blurryImage);

      expect(result.metadata.imageQuality).toBe('poor');
      expect(result.productIdentification.confidence).toBeLessThan(0.6);
    });
  });
});
```

### Mocking Strategy

```typescript
// Mock external dependencies
jest.mock('@anthropic-ai/sdk', () => ({
  Anthropic: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{
          text: JSON.stringify({
            name: 'iPhone 13 Pro',
            brand: 'Apple',
            confidence: 0.95
          })
        }]
      })
    }
  }))
}));

// Mock database calls
jest.mock('../db', () => ({
  query: jest.fn(),
  pool: {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn()
    })
  }
}));

// Test with mocks
describe('MarketIntelligenceAgent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use cached pricing data when available', async () => {
    const mockCachedData = {
      pricing: { averagePrice: 699.99 },
      timestamp: new Date()
    };

    (db.query as jest.Mock).mockResolvedValueOnce({
      rows: [mockCachedData]
    });

    const agent = new MarketIntelligenceAgent();
    const result = await agent.research({
      product: { name: 'iPhone 13 Pro' },
      condition: 'EXCELLENT'
    });

    expect(result.metadata.cacheHit).toBe(true);
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});
```

### Property-Based Testing (Fast-Check)

```typescript
import fc from 'fast-check';

describe('PriceCalculation', () => {
  it('should always return price within bounds', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.01, max: 10000 }), // basePrice
        fc.float({ min: 0.1, max: 1.0 }),    // conditionMultiplier
        (basePrice, conditionMultiplier) => {
          const calculator = new PriceCalculator();
          const result = calculator.calculate(basePrice, conditionMultiplier);

          expect(result).toBeGreaterThan(0);
          expect(result).toBeLessThanOrEqual(basePrice);
          expect(result).toBeGreaterThanOrEqual(basePrice * conditionMultiplier);
        }
      )
    );
  });
});
```

---

## Integration Tests

### Test Containers (Docker)

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer } from 'testcontainers';

describe('Market Intelligence Integration', () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let redisContainer: StartedGenericContainer;
  let agent: MarketIntelligenceAgent;

  beforeAll(async () => {
    // Start PostgreSQL with pgvector
    postgresContainer = await new PostgreSqlContainer('ankane/pgvector:latest')
      .withDatabase('test_boomer')
      .withUsername('test')
      .withPassword('test')
      .start();

    // Start Redis
    redisContainer = await new GenericContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .start();

    // Initialize agent with test containers
    agent = new MarketIntelligenceAgent({
      databaseUrl: postgresContainer.getConnectionUri(),
      redisUrl: `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`
    });

    // Run migrations
    await runMigrations(postgresContainer.getConnectionUri());
  }, 60000); // 60s timeout for container startup

  afterAll(async () => {
    await postgresContainer.stop();
    await redisContainer.stop();
  });

  it('should scrape eBay and cache results', async () => {
    const result = await agent.research({
      product: {
        name: 'iPhone 13 Pro',
        brand: 'Apple',
        model: '13 Pro'
      },
      condition: 'EXCELLENT',
      marketplaces: ['ebay']
    });

    expect(result.pricingAnalysis).toHaveLength(1);
    expect(result.pricingAnalysis[0].platform).toBe('ebay');
    expect(result.pricingAnalysis[0].sampleSize).toBeGreaterThan(5);

    // Verify caching
    const cached = await agent.research({
      product: { name: 'iPhone 13 Pro', brand: 'Apple', model: '13 Pro' },
      condition: 'EXCELLENT',
      marketplaces: ['ebay']
    });

    expect(cached.metadata.cacheHit).toBe(true);
    expect(cached.metadata.researchDuration).toBeLessThan(100); // Fast cache retrieval
  });

  it('should handle concurrent requests efficiently', async () => {
    const products = [
      { name: 'iPhone 13', brand: 'Apple' },
      { name: 'Samsung Galaxy S23', brand: 'Samsung' },
      { name: 'iPad Pro', brand: 'Apple' }
    ];

    const startTime = Date.now();
    const results = await Promise.all(
      products.map(product =>
        agent.research({
          product,
          condition: 'EXCELLENT',
          marketplaces: ['ebay']
        })
      )
    );
    const duration = Date.now() - startTime;

    expect(results).toHaveLength(3);
    results.forEach(result => {
      expect(result.pricingAnalysis[0].sampleSize).toBeGreaterThan(0);
    });

    // Parallel execution should be faster than sequential
    expect(duration).toBeLessThan(15000); // <15s for 3 concurrent
  });
});
```

### API Contract Testing (Pact)

```typescript
import { Pact } from '@pact-foundation/pact';

describe('Vision Agent API Contract', () => {
  const provider = new Pact({
    consumer: 'listing-orchestrator',
    provider: 'vision-agent',
    port: 8080
  });

  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  describe('POST /analyze', () => {
    it('should return product analysis', async () => {
      await provider.addInteraction({
        state: 'product image is valid',
        uponReceiving: 'a request to analyze product',
        withRequest: {
          method: 'POST',
          path: '/analyze',
          headers: { 'Content-Type': 'multipart/form-data' }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            productIdentification: {
              name: like('iPhone 13 Pro'),
              brand: like('Apple'),
              confidence: like(0.95)
            },
            success: true
          }
        }
      });

      const client = new VisionAgentClient('http://localhost:8080');
      const result = await client.analyze(mockImageBuffer);

      expect(result.productIdentification.name).toBe('iPhone 13 Pro');
      await provider.verify();
    });
  });
});
```

---

## E2E Tests (Cypress)

### Full Workflow Testing

```typescript
// cypress/e2e/listing-workflow.cy.ts
describe('Complete Listing Workflow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.login('test@example.com', 'password');
  });

  it('should create multi-platform listing from image upload', () => {
    // Step 1: Upload image
    cy.get('[data-cy=upload-zone]').attachFile('iphone-13-pro.jpg');

    // Step 2: Wait for vision analysis (with loading indicator)
    cy.get('[data-cy=loading-spinner]').should('be.visible');
    cy.get('[data-cy=product-name]', { timeout: 10000 })
      .should('contain', 'iPhone 13 Pro');

    // Step 3: Verify auto-filled data
    cy.get('[data-cy=brand]').should('have.value', 'Apple');
    cy.get('[data-cy=condition]').should('contain', 'Excellent');
    cy.get('[data-cy=confidence-score]').should('contain', '95%');

    // Step 4: Check pricing recommendations
    cy.get('[data-cy=recommended-price]')
      .invoke('text')
      .then(text => {
        const price = parseFloat(text.replace(/[^0-9.]/g, ''));
        expect(price).to.be.within(600, 800); // Reasonable range for iPhone 13 Pro
      });

    // Step 5: Review platform-specific content
    cy.get('[data-cy=platform-tabs]').contains('eBay').click();
    cy.get('[data-cy=ebay-title]')
      .should('contain', 'Apple')
      .and('contain', 'iPhone 13 Pro');

    cy.get('[data-cy=platform-tabs]').contains('Facebook').click();
    cy.get('[data-cy=facebook-description]')
      .should('contain', 'Excellent Condition');

    // Step 6: Select platforms and publish
    cy.get('[data-cy=select-all-platforms]').check();
    cy.get('[data-cy=publish-button]').click();

    // Step 7: Wait for listing creation (saga pattern)
    cy.get('[data-cy=publishing-modal]').should('be.visible');
    cy.get('[data-cy=platform-status-ebay]', { timeout: 30000 })
      .should('contain', 'Success');
    cy.get('[data-cy=platform-status-facebook]', { timeout: 30000 })
      .should('contain', 'Success');
    cy.get('[data-cy=platform-status-mercari]', { timeout: 30000 })
      .should('contain', 'Success');

    // Step 8: Verify listing URLs
    cy.get('[data-cy=ebay-listing-url]')
      .should('have.attr', 'href')
      .and('match', /ebay\.com\/itm/);

    cy.get('[data-cy=facebook-listing-url]')
      .should('have.attr', 'href')
      .and('match', /facebook\.com\/marketplace/);

    cy.get('[data-cy=mercari-listing-url]')
      .should('have.attr', 'href')
      .and('match', /mercari\.com\/item/);

    // Step 9: Verify analytics tracking
    cy.get('[data-cy=success-message]')
      .should('contain', '3 platforms');
    cy.get('[data-cy=view-dashboard]').click();

    cy.get('[data-cy=dashboard-total-listings]')
      .invoke('text')
      .then(count => {
        expect(parseInt(count)).to.be.greaterThan(0);
      });
  });

  it('should handle partial platform failures gracefully', () => {
    // Mock eBay API to fail
    cy.intercept('POST', '/api/platforms/ebay/create', {
      statusCode: 500,
      body: { error: 'eBay API temporarily unavailable' }
    }).as('ebayFail');

    cy.get('[data-cy=upload-zone]').attachFile('test-product.jpg');
    cy.get('[data-cy=product-name]', { timeout: 10000 }).should('be.visible');

    cy.get('[data-cy=select-all-platforms]').check();
    cy.get('[data-cy=publish-button]').click();

    // Verify partial success
    cy.wait('@ebayFail');
    cy.get('[data-cy=platform-status-ebay]', { timeout: 30000 })
      .should('contain', 'Failed');
    cy.get('[data-cy=platform-status-facebook]', { timeout: 30000 })
      .should('contain', 'Success');

    // Verify rollback option
    cy.get('[data-cy=rollback-button]').should('be.visible');
    cy.get('[data-cy=retry-failed-button]').should('be.visible');
  });
});
```

### Visual Regression Testing

```typescript
// cypress/e2e/visual-regression.cy.ts
describe('Visual Regression', () => {
  it('should match baseline screenshots', () => {
    cy.visit('/dashboard');
    cy.matchImageSnapshot('dashboard-view');

    cy.get('[data-cy=upload-zone]').attachFile('test-product.jpg');
    cy.get('[data-cy=analysis-results]', { timeout: 10000 }).should('be.visible');
    cy.matchImageSnapshot('analysis-results');
  });
});
```

---

## Performance Testing (k6)

### Load Testing

```javascript
// k6/vision-agent-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% requests < 5s
    http_req_failed: ['rate<0.05'],     // <5% error rate
    errors: ['rate<0.1'],               // <10% business logic errors
  },
};

export default function () {
  const image = open('../test/fixtures/iphone-13-pro.jpg', 'b');

  const payload = {
    image: http.file(image, 'iphone.jpg', 'image/jpeg'),
  };

  const res = http.post('http://localhost:8080/analyze', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has product': (r) => {
      const body = JSON.parse(r.body);
      return body.productIdentification !== undefined;
    },
    'confidence > 0.6': (r) => {
      const body = JSON.parse(r.body);
      return body.productIdentification.confidence > 0.6;
    },
  });

  errorRate.add(!success);
  sleep(1);
}
```

### Stress Testing

```javascript
// k6/stress-test.js
export const options = {
  stages: [
    { duration: '5m', target: 200 },   // Beyond normal load
    { duration: '10m', target: 200 },  // Sustained stress
    { duration: '5m', target: 500 },   // Breaking point
    { duration: '5m', target: 500 },   // Sustained break
    { duration: '5m', target: 0 },     // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(99)<30000'], // Allow degradation but not failure
    http_req_failed: ['rate<0.1'],      // <10% failures acceptable under stress
  },
};
```

### Soak Testing (Endurance)

```javascript
// k6/soak-test.js
export const options = {
  stages: [
    { duration: '5m', target: 100 },    // Ramp to normal load
    { duration: '8h', target: 100 },    // Sustained for 8 hours
    { duration: '5m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.05'],
  },
};
// Detects memory leaks, resource exhaustion over time
```

---

## Test Data Management

### Fixtures

```
test/fixtures/
├── images/
│   ├── iphone-13-pro.jpg
│   ├── blurry-image.jpg
│   ├── samsung-galaxy-s23.jpg
│   └── corrupt-image.txt
├── market-data/
│   ├── ebay-iphone-listings.json
│   ├── facebook-marketplace-sample.json
│   └── mercari-pricing.json
└── expected-outputs/
    ├── vision-iphone-13-pro.json
    └── description-ebay-formatted.json
```

### Factory Pattern (Test Data Builders)

```typescript
// test/factories/product.factory.ts
export class ProductFactory {
  static createVisionResponse(overrides?: Partial<VisionResponse>): VisionResponse {
    return {
      productIdentification: {
        name: 'iPhone 13 Pro',
        brand: 'Apple',
        model: '13 Pro',
        category: 'Electronics',
        subcategory: 'Smartphones',
        confidence: 0.95,
        ...overrides?.productIdentification
      },
      attributes: {
        color: 'Graphite',
        size: '256GB',
        ...overrides?.attributes
      },
      visualFeatures: {
        dominantColors: ['#333333', '#FFFFFF'],
        detectedText: ['Apple', 'iPhone'],
        logoDetections: [{ brand: 'Apple', confidence: 0.99 }]
      },
      similarProducts: [],
      metadata: {
        processingTime: 2300,
        modelVersion: 'claude-3-5-sonnet-20241022',
        imageQuality: 'excellent'
      },
      success: true,
      timestamp: new Date(),
      requestId: 'test-request-id',
      ...overrides
    };
  }
}

// Usage
it('should process vision response', () => {
  const product = ProductFactory.createVisionResponse({
    productIdentification: { confidence: 0.85 }
  });

  expect(product.productIdentification.confidence).toBe(0.85);
});
```

---

## CI/CD Testing Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: ankane/pgvector:latest
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Start services
        run: docker-compose -f docker-compose.test.yml up -d

      - name: Wait for services
        run: |
          timeout 60 bash -c 'until curl -f http://localhost:3000/health; do sleep 2; done'

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Cypress videos
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: cypress/videos

  performance-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Start services
        run: docker-compose up -d

      - name: Run load tests
        run: k6 run --out json=test-results.json k6/vision-agent-load.js

      - name: Verify performance thresholds
        run: |
          if grep -q '"failed": true' test-results.json; then
            echo "Performance thresholds exceeded"
            exit 1
          fi
```

---

## Quality Gates

### Pre-Commit Checks

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linter
npm run lint

# Run type checking
npm run typecheck

# Run unit tests for staged files
npm run test:unit -- --onlyChanged --bail

# Check formatting
npm run format:check
```

### Pre-Push Checks

```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Full test suite
npm run test:all

# Build check
npm run build

# Check for TODO/FIXME in committed code
git diff origin/main --name-only | xargs grep -l 'TODO\|FIXME' && {
  echo "❌ Found TODO/FIXME in changes. Resolve before pushing."
  exit 1
}
```

### Deployment Gates

```yaml
# Production deployment criteria
quality_gates:
  - code_coverage: ">= 85%"
  - e2e_pass_rate: "100%"
  - performance_p95: "< 5s"
  - error_rate: "< 1%"
  - security_scan: "no_critical_vulnerabilities"
```

---

## Monitoring Tests in Production

### Synthetic Monitoring

```typescript
// Datadog Synthetic Test
{
  "type": "api",
  "name": "Vision Agent - Product Analysis",
  "request": {
    "method": "POST",
    "url": "https://api.boomer.com/analyze",
    "body": "${TEST_IMAGE}",
    "headers": {
      "Authorization": "Bearer ${API_KEY}"
    }
  },
  "assertions": [
    { "type": "statusCode", "operator": "is", "target": 200 },
    { "type": "responseTime", "operator": "lessThan", "target": 5000 },
    { "type": "body", "operator": "contains", "target": "productIdentification" }
  ],
  "locations": ["aws:us-east-1", "aws:us-west-2"],
  "options": {
    "tick_every": 300, // Run every 5 minutes
    "min_failure_duration": 600 // Alert after 10 minutes of failures
  }
}
```

### Smoke Tests (Post-Deployment)

```bash
#!/bin/bash
# scripts/smoke-test.sh

API_URL="${1:-https://api.boomer.com}"

echo "🧪 Running smoke tests against $API_URL"

# Health check
curl -f "$API_URL/health" || exit 1

# Vision agent
curl -f -X POST "$API_URL/analyze" \
  -F "image=@test/fixtures/iphone-13-pro.jpg" || exit 1

# Market intelligence
curl -f -X POST "$API_URL/research" \
  -H "Content-Type: application/json" \
  -d '{"product":{"name":"iPhone 13 Pro"},"condition":"EXCELLENT"}' || exit 1

echo "✅ Smoke tests passed"
```

---

## Test Metrics Dashboard

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "BOOMER Test Metrics",
    "panels": [
      {
        "title": "Test Coverage Trend",
        "targets": [{
          "expr": "test_coverage_percentage"
        }],
        "type": "graph"
      },
      {
        "title": "Test Execution Time",
        "targets": [{
          "expr": "avg(test_duration_seconds) by (suite)"
        }]
      },
      {
        "title": "Flaky Test Rate",
        "targets": [{
          "expr": "rate(test_failures_total{reason='flaky'}[1h])"
        }]
      }
    ]
  }
}
```

---

## Conclusion

This testing strategy ensures:
- ✅ **95%+ confidence** in code quality
- ✅ **Fast feedback loops** (unit tests <30s, integration <5min)
- ✅ **Production reliability** (synthetic monitoring, smoke tests)
- ✅ **Performance validation** (load/stress/soak testing)
- ✅ **Regression prevention** (visual, API contract, E2E tests)
