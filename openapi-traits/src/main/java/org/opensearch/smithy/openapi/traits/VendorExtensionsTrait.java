package org.opensearch.smithy.openapi.traits;

import software.amazon.smithy.model.node.Node;
import software.amazon.smithy.model.node.ObjectNode;
import software.amazon.smithy.model.shapes.ShapeId;
import software.amazon.smithy.model.traits.AbstractTrait;
import software.amazon.smithy.model.traits.AbstractTraitBuilder;
import software.amazon.smithy.model.traits.Trait;
import software.amazon.smithy.utils.SmithyBuilder;
import software.amazon.smithy.utils.ToSmithyBuilder;

public final class VendorExtensionsTrait extends AbstractTrait implements ToSmithyBuilder<VendorExtensionsTrait> {
    public static final ShapeId ID = ShapeId.from("opensearch.openapi#vendorExtensions");

    private final ObjectNode node;

    private VendorExtensionsTrait(Builder builder) {
        super(ID, builder.getSourceLocation());
        this.node = SmithyBuilder.requiredState("node", builder.node);
    }

    public static final class Provider extends AbstractTrait.Provider {
        public Provider() {
            super(ID);
        }

        @Override
        public Trait createTrait(ShapeId target, Node value) {
            ObjectNode node = value.expectObjectNode();
            VendorExtensionsTrait trait = builder().sourceLocation(value).node(node).build();
            trait.setNodeCache(value);
            return trait;
        }
    }

    public ObjectNode getNode() {
        return this.node;
    }

    public static Builder builder() {
        return new Builder();
    }

    @Override
    protected Node createNode() {
        return Node.objectNodeBuilder()
                .sourceLocation(getSourceLocation())
                .merge(node)
                .build();
    }

    @Override
    public Builder toBuilder() {
        return builder()
                .sourceLocation(getSourceLocation())
                .node(node);
    }

    public static final class Builder extends AbstractTraitBuilder<VendorExtensionsTrait, Builder> {
        private ObjectNode node;

        private Builder() {
        }

        @Override
        public VendorExtensionsTrait build() {
            return new VendorExtensionsTrait(this);
        }

        public Builder node(ObjectNode node) {
            this.node = node;
            return this;
        }
    }
}
