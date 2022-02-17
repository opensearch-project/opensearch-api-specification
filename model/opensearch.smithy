namespace OpenSearch

use aws.protocols#restJson1


@restJson1
service OpenSearch {
    version: "2021-11-23",
    operations: [PutIndexMapping, PutIndexMappingWithIndex]
}