import OpenApiMerger from "./OpenApiMerger";


const root_path: string = process.argv[2] || '../spec/opensearch-openapi.yaml'
const output_path: string = process.argv[3] || '../opensearch-openapi.yaml'
const merger = new OpenApiMerger(root_path);
merger.merge(output_path);
