import OpenApiMerger from "./OpenApiMerger";


async function main() {
    const merger = new OpenApiMerger('../spec/OpenSearch.openapi.yaml');
    merger.merge('../builds/OpenSearch.latest.yaml');
}

main();