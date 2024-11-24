This container contains data from a detached cluster with a `movies` index. It was created as follows.

Data will be stored in [opensearch-data1](./opensearch-data1).

From this `.data` directory.

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
  -v $(pwd)/opensearch-data1:/usr/share/opensearch/data \
  opensearchproject/opensearch:latest
```

Start the service.

```
./opensearch-docker-entrypoint.sh
```

From another shell, add data.

```
curl -X POST http://localhost:9200/movies/_doc --json '{"director":"Bennett Miller","title":"The Cruise","year":1998}'

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

The cluster in [docker-compose](docker-compose.yml) uses this data. Start it.

```
docker compose up
```

After the service starts the `movies` index is dangling.

To make it usable in tests we need to turn it to a single node cluster.

Remove replicas.

```
curl -X PUT  http://localhost:9200/_settings --json '{"index.number_of_replicas":0}'

{"acknowledged":true}
```

Remove node2 from voting.

```
curl -X POST http://localhost:9200/_cluster/voting_config_exclusions?node_names=opensearch-node2

{"acknowledged":true}
```

Stop the cluster.

Remove lock files, those will cause an "Underlying file changed by an external force" error when copied to the docker container.

```
find . -name *.lock | xargs rm 
```

Now you can run the [single-node docker-compose](../docker-compose.yml) in the folder above.
