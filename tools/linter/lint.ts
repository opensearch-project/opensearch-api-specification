import NamespaceFileValidator from './NamespaceFileValidator'


async function lint() {
    const validator = new NamespaceFileValidator('../spec/namespaces/_core.yaml');
    validator.validate();
    console.log(validator.errors);
}

lint();

// TODO - Validate the following:
//  - Namespace Files:
//      - x-operation-group (namespace)
//      - naming schemes of components
// - No dup paths
// - Autocorrect: fill missing paths in root spec