$version: "2"

namespace opensearch.openapi

@protocolDefinition
@trait(selector: "service")
structure restJson {}

@trait(
    selector: ":is(simpleType, list, map, structure, union, operation, member)"
)
map vendorExtensions {
    @pattern("^x-.+$")
    key: String
    value: Document
}
