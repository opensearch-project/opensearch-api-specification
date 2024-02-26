import OpenApiValidator from "./OpenApiValidator";


async function lint() {
    await OpenApiValidator.validate();
}

lint();

// TODO - Validate the following:
//  - Namespace Files:
//      - x-operation-group (namespace)
//      - naming schemes of components
// - No dup paths
// - Autocorrect: fill missing paths in root spec