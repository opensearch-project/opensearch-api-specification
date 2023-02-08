$version: "2"

namespace opensearch.openapi

@trait(
    selector: ":is(simpleType, list, map, structure, union, operation, member)"
)
map vendorExtensions {
    @pattern("^x-.+$")
    key: String
    value: Document
}
