package org.opensearch.smithy.openapi.extensions;

import org.opensearch.smithy.openapi.extensions.mappers.VendorExtensionsJsonSchemaMapper;
import org.opensearch.smithy.openapi.extensions.mappers.VendorExtensionsOpenApiMapper;
import software.amazon.smithy.jsonschema.JsonSchemaMapper;
import software.amazon.smithy.model.traits.Trait;
import software.amazon.smithy.openapi.fromsmithy.OpenApiMapper;
import software.amazon.smithy.openapi.fromsmithy.OpenApiProtocol;
import software.amazon.smithy.openapi.fromsmithy.Smithy2OpenApiExtension;
import software.amazon.smithy.openapi.fromsmithy.protocols.OpenSearchRestJsonProtocol;

import java.util.List;

public class OpenSearchOpenApiExtension implements Smithy2OpenApiExtension {
    @Override
    public List<OpenApiProtocol<? extends Trait>> getProtocols() {
        return List.of(new OpenSearchRestJsonProtocol());
    }

    @Override
    public List<JsonSchemaMapper> getJsonSchemaMappers() {
        return List.of(new VendorExtensionsJsonSchemaMapper());
    }

    @Override
    public List<OpenApiMapper> getOpenApiMappers() {
        return List.of(new VendorExtensionsOpenApiMapper());
    }
}
