import SchemasFolder from "../../linter/components/SchemasFolder";
import NamespacesFolder from "../../linter/components/NamespacesFolder";
import SchemaRefsValidator from "../../linter/SchemaRefsValidator";

test('validate()', () => {
    const root_folder = './test/linter/fixtures/schema_refs_validator';
    const namespaces_folder = new NamespacesFolder(`${root_folder}/namespaces`);
    const schemas_folder = new SchemasFolder(`${root_folder}/schemas`);
    const validator = new SchemaRefsValidator(namespaces_folder, schemas_folder);
    expect(validator.validate()).toEqual([
        {
            file: "schemas/animals.yaml",
            location: "#/components/schemas/Crab",
            message: "Unresolved schema reference: Schema Crab is referenced but does not exist."
        },
        {
            file: "namespaces/",
            message: "Unresolved schema reference: Schema file schemas/vehicles.yaml is referenced but does not exist."
        },
        {
            file: "schemas/animals.yaml",
            location: "#/components/schemas/Goat",
            message: "Unreferenced schema: Schema Goat is not referenced anywhere."
        },
        {
            file: "schemas/others.yaml",
            message: "Unreferenced schema: Schema file schemas/others.yaml is not referenced anywhere."
        }
    ]);
});