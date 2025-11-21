# Quick Start Guide - Semantic Field Tests

## TL;DR

```bash
# 1. Start OpenSearch with ML Commons
cd tests/plugins/ml
docker compose up -d
sleep 60

# 2. Run tests
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_basic.yaml

# 3. Cleanup
docker compose down -v
```

## Quick Commands

### Run All Semantic Tests
```bash
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_*.yaml \
  --verbose
```

### Run Individual Tests

**Basic functionality:**
```bash
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_basic.yaml
```

**Advanced features:**
```bash
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_advanced.yaml
```

**Error handling:**
```bash
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_error_cases.yaml
```

## Expected Output

### Successful Test Run
```
PASSED  semantic_basic.yaml (tests/plugins/ml/mapping/semantic_basic.yaml)
  ✓ Register a text embedding model
  ✓ Wait for model registration task to complete
  ✓ Deploy the registered model
  ✓ Wait for model deployment to complete
  ✓ Create an index with a semantic field mapping
  ✓ Get mappings to verify semantic field
  ✓ Get specific semantic field mapping
  ✓ Index a document with semantic field content
  ✓ Create an index with multiple semantic fields
  ✓ Update mapping to add another semantic field
  ✓ Verify mapping includes newly added semantic field

Chapters: 11/11 passed
Time: ~3-5 minutes
```

## Environment Variables

```bash
# Required
export OPENSEARCH_PASSWORD=myStrongPassword123!

# Optional
export OPENSEARCH_VERSION=3.1.0
export OPENSEARCH_DOCKER_HUB_PROJECT=opensearchproject
export OPENSEARCH_JAVA_OPTS="-Xms2g -Xmx2g"
```

## Debugging Failed Tests

### Check cluster health
```bash
curl -k -u admin:$OPENSEARCH_PASSWORD \
  https://localhost:9200/_cluster/health?pretty
```

### Check ML plugin
```bash
curl -k -u admin:$OPENSEARCH_PASSWORD \
  https://localhost:9200/_cat/plugins
```

### Check ML tasks
```bash
curl -k -u admin:$OPENSEARCH_PASSWORD \
  https://localhost:9200/_plugins/_ml/tasks/_search?pretty
```

### Check logs
```bash
docker logs opensearch-cluster --tail 100 -f
```

## Test Coverage

| Test File | Chapters | Features Tested |
|-----------|----------|-----------------|
| semantic_basic.yaml | 11 | Basic CRUD, single/multiple fields |
| semantic_advanced.yaml | 11 | All config options, chunking, embeddings |
| semantic_error_cases.yaml | 6 | Validation, error handling |
| **Total** | **28** | Complete semantic field functionality |

## File Structure

```
tests/plugins/ml/mapping/
├── README.md                    # Full documentation
├── QUICK_START.md              # This file
├── semantic_basic.yaml         # Basic tests
├── semantic_advanced.yaml      # Advanced tests
└── semantic_error_cases.yaml   # Error tests

tests/plugins/ml/semantic/
└── docker-compose.yml          # Semantic-specific config
```

## Next Steps

1. ✅ Run the basic tests to verify setup
2. ✅ Run advanced tests for full coverage
3. ✅ Review test output with `--verbose`
4. ✅ Add custom test scenarios as needed
5. ✅ Integrate into CI/CD pipeline

For detailed information, see [README.md](README.md).

