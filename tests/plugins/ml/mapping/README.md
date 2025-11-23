# Semantic Field Type Tests

This directory contains integration tests for the Semantic field type introduced in OpenSearch 3.1.

## Overview

The Semantic field type is a specialized field mapping that enables semantic search capabilities by automatically generating and managing embeddings using ML models. These tests validate:

- Basic semantic field creation and configuration
- Advanced features (chunking, dense/sparse embeddings, custom analyzers)
- Error handling and validation
- Document indexing and retrieval with semantic fields

## Test Files

### semantic_basic.yaml
Tests basic semantic field functionality:
- Creating indexes with semantic fields
- Required properties (`type`, `model_id`)
- Retrieving mappings
- Updating mappings to add semantic fields
- Indexing documents with semantic content
- Multiple semantic fields in a single index

### semantic_advanced.yaml
Tests advanced semantic field features:
- `search_model_id` - separate model for search operations
- `raw_field_type` - underlying field type configuration
- `semantic_info_field_name` - custom metadata field name
- `semantic_field_search_analyzer` - custom search analyzer
- `skip_existing_embedding` - skip re-embedding existing content
- `chunking` - both boolean and array configurations with algorithms
- `dense_embedding_config` - HNSW configuration for dense vectors
- `sparse_encoding_config` - pruning configuration for sparse encodings

### semantic_error_cases.yaml
Tests error handling and validation:
- Missing required `model_id` parameter
- Non-existent model references
- Invalid chunking configurations
- Invalid embedding configurations
- Non-existent index/field queries

## Prerequisites

### OpenSearch Version
- OpenSearch 3.1 or later (when semantic field is released)
- ML Commons plugin installed and enabled

### ML Models
The tests register and deploy ML models during setup. The following models are used:
- `huggingface/sentence-transformers/all-MiniLM-L12-v2` - for basic inference
- `huggingface/sentence-transformers/msmarco-distilbert-base-tas-b` - for search operations

**Note**: Model registration and deployment can take several minutes. The tests include retry logic with appropriate timeouts.

## Running the Tests

### Using the Default ML Docker Compose Setup

The semantic field tests can run using the existing ML plugin docker-compose configuration:

```bash
# Set up OpenSearch cluster with ML Commons
export OPENSEARCH_PASSWORD=myStrongPassword123!
cd tests/plugins/ml
docker compose up -d

# Wait for cluster to be ready (may take 1-2 minutes)
sleep 60

# Run semantic field tests
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_basic.yaml \
  --verbose

# Run advanced tests
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_advanced.yaml \
  --verbose

# Run error case tests
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_error_cases.yaml \
  --verbose

# Run all semantic tests
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/semantic_*.yaml \
  --verbose
```

### Using Docker Compose

The ML plugin docker-compose includes all necessary settings for semantic fields:

```bash
export OPENSEARCH_PASSWORD=myStrongPassword123!
cd tests/plugins/ml
docker compose up -d

# Wait for cluster
sleep 60

# Run semantic field tests
npm run test:spec -- --opensearch-insecure \
  --tests tests/plugins/ml/mapping/ \
  --verbose
```

### Cleanup

```bash
# Stop and remove containers
docker compose down -v

# Remove test data
docker volume prune -f
```

## Test Execution Time

⚠️ **Important**: These tests take longer than typical API tests due to ML model operations.

Typical execution times:
- **semantic_basic.yaml**: ~3-5 minutes (includes model registration and deployment)
- **semantic_advanced.yaml**: ~5-8 minutes (includes two model registrations)
- **semantic_error_cases.yaml**: ~1-2 minutes (no model deployment needed)

The majority of time is spent waiting for:
1. Model registration (30-60 seconds per model)
2. Model deployment (60-120 seconds per model)
3. Model warmup and initialization

## Troubleshooting

### Tests Timeout During Model Registration

If tests fail with timeout errors during model registration:

1. Check ML Commons plugin is loaded:
   ```bash
   curl -k -u admin:$OPENSEARCH_PASSWORD \
     https://localhost:9200/_cat/plugins
   ```

2. Check ML task status:
   ```bash
   curl -k -u admin:$OPENSEARCH_PASSWORD \
     https://localhost:9200/_plugins/_ml/tasks/<task_id>
   ```

3. Increase retry count/wait time in test prologues if needed

### Memory Issues

Semantic field operations require sufficient memory:
- Ensure Docker has at least 4GB RAM allocated
- Check cluster health: `curl -k -u admin:$OPENSEARCH_PASSWORD https://localhost:9200/_cluster/health`
- Monitor JVM heap: `curl -k -u admin:$OPENSEARCH_PASSWORD https://localhost:9200/_nodes/stats/jvm`

### Model Download Failures

If model registration fails:
1. Check network connectivity from container
2. Verify the model URL is accessible
3. Check OpenSearch logs: `docker logs opensearch-cluster`
4. Ensure `plugins.ml_commons.allow_registering_model_via_url=true` is set

### Semantic Field Not Available

If semantic field type is not recognized:
1. Verify OpenSearch version >= 3.1
2. Check that ML Commons plugin supports semantic fields
3. Review OpenSearch release notes for semantic field availability

## CI/CD Integration

These tests are included in the spec testing workflow but are version-gated:

```yaml
- version: 3.1.0
  tests: plugins/ml/mapping
  hub: opensearchproject  # or opensearchstaging for snapshots
```

## Schema Validation

The semantic field schema is defined in:
- `spec/schemas/_common.mapping.yaml` - `SemanticProperty` schema
- Lines 973-1006 define the complete structure

## Related Documentation

- [ML Commons Plugin Documentation](https://opensearch.org/docs/latest/ml-commons-plugin/)
- [Semantic Search Documentation](https://opensearch.org/docs/latest/search-plugins/semantic-search/)
- [Test Story Schema](../../../../json_schemas/test_story.schema.yaml)
- [Testing Guide](../../../../TESTING_GUIDE.md)

## Contributing

When adding new semantic field features:

1. Update the schema in `spec/schemas/_common.mapping.yaml`
2. Add the feature to `FieldType` enum (line 151)
3. Add to `Property` oneOf discriminator (line 202)
4. Create test scenarios in appropriate test file
5. Update this README with new features
6. Run tests locally before submitting PR

## Examples

### Minimal Semantic Field

```yaml
properties:
  content:
    type: semantic
    model_id: my_text_embedding_model
```

### Full Configuration

```yaml
properties:
  content:
    type: semantic
    model_id: my_inference_model
    search_model_id: my_search_model
    raw_field_type: text
    semantic_info_field_name: _semantic_metadata
    semantic_field_search_analyzer: custom_analyzer
    skip_existing_embedding: true
    chunking:
      - algorithm: fixed
        parameters:
          chunk_size: 256
          overlap: 32
    dense_embedding_config:
      data_type: float
      mode: on_disk
      compression_level: 32x
      method:
        name: hnsw
        space_type: l2
        engine: faiss
        parameters:
          ef_construction: 128
          m: 16
    sparse_encoding_config:
      prune_type: top_k
      prune_ratio: 0.5
```

## Support

For issues with these tests:
1. Check [GitHub Issues](https://github.com/opensearch-project/opensearch-api-specification/issues)
2. Review test output with `--verbose` flag
3. Check OpenSearch logs for detailed error messages
4. Verify prerequisite models are available

For semantic field feature questions:
- Refer to ML Commons plugin documentation
- Check OpenSearch forum discussions

