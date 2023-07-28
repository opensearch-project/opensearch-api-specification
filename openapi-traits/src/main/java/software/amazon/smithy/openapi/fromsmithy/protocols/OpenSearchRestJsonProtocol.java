package software.amazon.smithy.openapi.fromsmithy.protocols;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.opensearch.smithy.openapi.traits.RestJsonTrait;
import software.amazon.smithy.jsonschema.Schema;
import software.amazon.smithy.model.knowledge.HttpBinding;
import software.amazon.smithy.model.node.Node;
import software.amazon.smithy.model.shapes.Shape;
import software.amazon.smithy.model.shapes.ShapeId;
import software.amazon.smithy.model.shapes.StructureShape;
import software.amazon.smithy.openapi.fromsmithy.Context;

public final class OpenSearchRestJsonProtocol extends AbstractRestProtocol<RestJsonTrait> {
    @Override
    public Class<RestJsonTrait> getProtocolType() {
        return RestJsonTrait.class;
    }

    @Override
    protected String getDocumentMediaType(Context<RestJsonTrait> context, Shape operationOrError, MessageType message) {
        return context.getConfig().getJsonContentType();
    }

    @Override
    protected Schema createDocumentSchema(Context<RestJsonTrait> context, Shape operationOrError, List<HttpBinding> bindings, MessageType messageType) {
        if (bindings.isEmpty()) {
            return Schema.builder().type("object").build();
        }

        // We create a synthetic structure shape that is passed through the
        // JSON schema converter. This shape only contains members that make
        // up the "document" members of the input/output/error shape.
        ShapeId container = bindings.get(0).getMember().getContainer();
        StructureShape containerShape = context.getModel().expectShape(container, StructureShape.class);

        // Path parameters of requests are handled in "parameters" and headers are
        // handled in headers, so this method must ensure that only members that
        // are sent in the document payload are present in the structure when it is
        // converted to OpenAPI. This ensures that any path parameters are removed
        // before converting the structure to a synthesized JSON schema object.
        // Doing this sanitation after converting the shape to JSON schema might
        // result in things like "required" properties pointing to members that
        // don't exist.
        Set<String> documentMemberNames = bindings.stream()
                .map(HttpBinding::getMemberName)
                .collect(Collectors.toSet());

        // Remove non-document members.
        StructureShape.Builder containerShapeBuilder = containerShape.toBuilder();
        for (String memberName : containerShape.getAllMembers().keySet()) {
            if (!documentMemberNames.contains(memberName)) {
                containerShapeBuilder.removeMember(memberName);
            }
        }

        StructureShape cleanedShape = containerShapeBuilder.build();
        return context.getJsonSchemaConverter().convertShape(cleanedShape).getRootSchema();
    }

    @Override
    protected Node transformSmithyValueToProtocolValue(Node value) {
        return value;
    }
}
