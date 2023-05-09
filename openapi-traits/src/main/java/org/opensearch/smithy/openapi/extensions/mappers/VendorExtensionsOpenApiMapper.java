package org.opensearch.smithy.openapi.extensions.mappers;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Optional;

import org.opensearch.smithy.openapi.traits.VendorExtensionsTrait;

import software.amazon.smithy.jsonschema.JsonSchemaConfig;
import software.amazon.smithy.model.shapes.OperationShape;
import software.amazon.smithy.model.shapes.Shape;
import software.amazon.smithy.model.traits.Trait;
import software.amazon.smithy.openapi.fromsmithy.Context;
import software.amazon.smithy.openapi.fromsmithy.OpenApiJsonSchemaMapper;
import software.amazon.smithy.openapi.fromsmithy.OpenApiMapper;
import software.amazon.smithy.openapi.model.ExternalDocumentation;
import software.amazon.smithy.openapi.model.OperationObject;

public class VendorExtensionsOpenApiMapper implements OpenApiMapper {
    private static final Method GET_RESOLVED_EXTERNAL_DOCS;

    static {
        try {
            GET_RESOLVED_EXTERNAL_DOCS = OpenApiJsonSchemaMapper.class.getDeclaredMethod("getResolvedExternalDocs", Shape.class, JsonSchemaConfig.class);
            GET_RESOLVED_EXTERNAL_DOCS.setAccessible(true);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException("Unable to get OpenApiJsonSchemaMapper.getResolvedExternalDocs method", e);
        }
    }

    private static Optional<ExternalDocumentation> getResolvedExternalDocs(Shape shape, JsonSchemaConfig config) {
        try {
            return (Optional<ExternalDocumentation>) GET_RESOLVED_EXTERNAL_DOCS.invoke(null, shape, config);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Failed calling OpenApiJsonSchemaMapper.getResolvedExternalDocs method", e);
        }
    }

    @Override
    public OperationObject updateOperation(Context<? extends Trait> context, OperationShape shape, OperationObject operation, String httpMethodName, String path) {
        OperationObject.Builder builder = operation.toBuilder();

        getResolvedExternalDocs(shape, context.getConfig()).ifPresent(builder::externalDocs);

        shape.getTrait(VendorExtensionsTrait.class)
                .ifPresent(trait -> {
                    trait.getNode()
                            .getMembers()
                            .forEach((k, v) -> builder.putExtension(k.getValue(), v));
                });

        return builder.build();
    }
}
