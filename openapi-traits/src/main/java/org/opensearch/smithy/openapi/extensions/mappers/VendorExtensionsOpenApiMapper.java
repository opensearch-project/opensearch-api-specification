package org.opensearch.smithy.openapi.extensions.mappers;

import org.opensearch.smithy.openapi.traits.VendorExtensionsTrait;
import software.amazon.smithy.model.shapes.OperationShape;
import software.amazon.smithy.model.traits.Trait;
import software.amazon.smithy.openapi.fromsmithy.Context;
import software.amazon.smithy.openapi.fromsmithy.OpenApiMapper;
import software.amazon.smithy.openapi.model.OperationObject;

public class VendorExtensionsOpenApiMapper implements OpenApiMapper {
    @Override
    public OperationObject updateOperation(Context<? extends Trait> context, OperationShape shape, OperationObject operation, String httpMethodName, String path) {
        return shape.getTrait(VendorExtensionsTrait.class)
                .map(trait -> {
                    OperationObject.Builder builder = operation.toBuilder();

                    trait.getNode()
                            .getMembers()
                            .forEach((k, v) -> builder.putExtension(k.getValue(), v));

                    return builder.build();
                })
                .orElse(operation);
    }
}
