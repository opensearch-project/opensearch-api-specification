import OpenApiMerger from "./OpenApiMerger";


async function main() {
    const root_path: string = process.argv[2]; // '../spec/OpenSearch.openapi.yaml'
    const output_path: string = process.argv[3]; // '../builds/OpenSearch.latest.yaml'
    const merger = new OpenApiMerger(root_path);
    merger.merge(output_path);
}

main();