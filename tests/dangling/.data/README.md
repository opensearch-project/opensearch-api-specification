This container contains data from a detached cluster with a `movies` index. It was created as follows.

Data will be stored in [.data/opensearch-data1](.data/opensearch-data1).

```
rm -rf .data
```

Create a single-node cluster (without security) and open a shell in it.

```
docker run --name opensearch-single-node-cluster\
  -it --entrypoint /bin/bash \
  -p 9200:9200 -p 9600:9600 \
  -e "discovery.type=single-node" \
  --ulimit memlock=-1:-1 \
  --ulimit nofile=65536:65536 \
  -e DISABLE_INSTALL_DEMO_CONFIG=true \
  -e DISABLE_SECURITY_PLUGIN=true \
  -v $(pwd)/.data/opensearch-data1:/usr/share/opensearch/data \
  opensearchproject/opensearch:latest
```

Start the service.

```
./opensearch-docker-entrypoint.sh
```

From another shell, add data.

```
curl -X POST -u admin:$OPENSEARCH_PASSWORD http://localhost:9200/movies/_doc --json '{"director":"Bennett Miller","title":"The Cruise","year":1998}'

{"_index":"movies","_id":"XBDMTpMBjBlaZgUqAkGm","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"_seq_no":0,"_primary_term":1}
```

Remove replicas.

```
curl -X PUT  http://localhost:9200/movies/_settings --json '{"index.number_of_replicas":0}'

{"acknowledged":true}
```

Stop the service with Ctrl+C.

Detach cluster.

```
./bin/opensearch-node detach-cluster

Confirm [y/N] y
Node was successfully detached from the cluster
```

The cluster in [docker-compose](docker-compose.yml) uses this data. After the service starts the `movies` index is dangling.

```
docker compose up
```