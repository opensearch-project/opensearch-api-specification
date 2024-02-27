import OpenApiMerger from "./OpenApiMerger";


async function main() {
    const merger = new OpenApiMerger('../spec/OpenSearch.openapi.yaml');
    merger.merge('../OpenSearch.openapi.yaml');
}

main();