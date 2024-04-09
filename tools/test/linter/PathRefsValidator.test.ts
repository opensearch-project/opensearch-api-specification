import PathRefsValidator from "../../linter/PathRefsValidator";
import RootFile from "../../linter/components/RootFile";
import NamespacesFolder from "../../linter/components/NamespacesFolder";

test('validate()', () => {
    const root_folder = './test/linter/fixtures/path_refs_validator';
    const root_file = new RootFile(`${root_folder}/opensearch-openapi.yaml`);
    const namespaces_folder = new NamespacesFolder(`${root_folder}/namespaces`);
    const validator = new PathRefsValidator(root_file, namespaces_folder);
    expect(validator.validate()).toEqual([
        {
            file: "opensearch-openapi.yaml",
            location: "Path: /{index}",
            message: "Unresolved path reference: Path /{index} does not exist in namespace file namespaces/indices.yaml"
        },
        {
            file: "opensearch-openapi.yaml",
            location: "Paths: /_cluster/health , /_cluster/{id}",
            message: "Unresolved path reference: Namespace file namespaces/cluster.yaml does not exist."
        },
        {
            file: "namespaces/indices.yaml",
            location: "Path: /{index}/_aliases",
            message: "Unreferenced path: Path /{index}/_aliases is not referenced in the root file."
        },
        {
            file: "namespaces/missing.yaml",
            message: "Unreferenced paths: No paths are referenced in the root file."
        }
    ]);
});