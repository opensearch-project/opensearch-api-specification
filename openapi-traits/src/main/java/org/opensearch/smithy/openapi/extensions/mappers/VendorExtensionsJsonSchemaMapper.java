package org.opensearch.smithy.openapi.extensions.mappers;

import org.opensearch.smithy.openapi.traits.VendorExtensionsTrait;
import software.amazon.smithy.jsonschema.JsonSchemaConfig;
import software.amazon.smithy.jsonschema.JsonSchemaMapper;
import software.amazon.smithy.jsonschema.Schema;
import software.amazon.smithy.model.shapes.Shape;

public class VendorExtensionsJsonSchemaMapper implements JsonSchemaMapper {
    @Override
    public Schema.Builder updateSchema(Shape shape, Schema.Builder schemaBuilder, JsonSchemaConfig config) {
        shape.getTrait(VendorExtensionsTrait.class)
                .ifPresent(trait -> trait.getNode()
                        .getMembers()
                        .forEach((k, v) -> schemaBuilder.putExtension(k.getValue(), v)));

        return schemaBuilder;
    }
}
