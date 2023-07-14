package org.opensearch.smithy.openapi.traits;

import software.amazon.smithy.model.node.Node;
import software.amazon.smithy.model.node.ObjectNode;
import software.amazon.smithy.model.shapes.ShapeId;
import software.amazon.smithy.model.traits.AbstractTrait;
import software.amazon.smithy.model.traits.AbstractTraitBuilder;
import software.amazon.smithy.model.traits.Trait;
import software.amazon.smithy.utils.ToSmithyBuilder;

public class RestJsonTrait extends AbstractTrait implements ToSmithyBuilder<RestJsonTrait> {
    public static final ShapeId ID = ShapeId.from("opensearch.openapi#restJson");

    private RestJsonTrait(Builder builder) {
        super(ID, builder.getSourceLocation());
    }

    public static final class Provider extends AbstractTrait.Provider {
        public Provider() {
            super(ID);
        }

        @Override
        public Trait createTrait(ShapeId target, Node value) {
            ObjectNode node = value.expectObjectNode();
            RestJsonTrait trait = builder().sourceLocation(value).build();
            trait.setNodeCache(value);
            return trait;
        }
    }

    public static RestJsonTrait.Builder builder() {
        return new RestJsonTrait.Builder();
    }

    @Override
    protected Node createNode() {
        return Node.objectNodeBuilder()
                .sourceLocation(getSourceLocation())
                .build();
    }

    @Override
    public RestJsonTrait.Builder toBuilder() {
        return builder()
                .sourceLocation(getSourceLocation());
    }

    public static final class Builder extends AbstractTraitBuilder<RestJsonTrait, RestJsonTrait.Builder> {
        private Builder() {
        }

        @Override
        public RestJsonTrait build() {
            return new RestJsonTrait(this);
        }
    }
}
