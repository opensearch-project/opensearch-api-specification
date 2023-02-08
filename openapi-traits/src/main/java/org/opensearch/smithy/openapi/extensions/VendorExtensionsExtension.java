package org.opensearch.smithy.openapi.extensions;

import org.opensearch.smithy.openapi.extensions.mappers.VendorExtensionsJsonSchemaMapper;
import org.opensearch.smithy.openapi.extensions.mappers.VendorExtensionsOpenApiMapper;
import software.amazon.smithy.jsonschema.JsonSchemaMapper;
import software.amazon.smithy.openapi.fromsmithy.OpenApiMapper;
import software.amazon.smithy.openapi.fromsmithy.Smithy2OpenApiExtension;

import java.util.List;

public class VendorExtensionsExtension implements Smithy2OpenApiExtension {
    @Override
    public List<JsonSchemaMapper> getJsonSchemaMappers() {
        return List.of(new VendorExtensionsJsonSchemaMapper());
    }

    @Override
    public List<OpenApiMapper> getOpenApiMappers() {
        return List.of(new VendorExtensionsOpenApiMapper());
    }
}
