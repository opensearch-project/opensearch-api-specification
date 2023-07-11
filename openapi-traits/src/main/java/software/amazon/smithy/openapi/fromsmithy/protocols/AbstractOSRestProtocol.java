package software.amazon.smithy.openapi.fromsmithy.protocols;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.function.BiFunction;
import software.amazon.smithy.jsonschema.Schema;
import software.amazon.smithy.model.knowledge.EventStreamIndex;
import software.amazon.smithy.model.knowledge.HttpBinding;
import software.amazon.smithy.model.knowledge.HttpBindingIndex;
import software.amazon.smithy.model.knowledge.OperationIndex;
import software.amazon.smithy.model.node.Node;
import software.amazon.smithy.model.shapes.OperationShape;
import software.amazon.smithy.model.shapes.ServiceShape;
import software.amazon.smithy.model.shapes.Shape;
import software.amazon.smithy.model.shapes.StructureShape;
import software.amazon.smithy.model.traits.ErrorTrait;
import software.amazon.smithy.model.traits.HttpTrait;
import software.amazon.smithy.model.traits.Trait;
import software.amazon.smithy.openapi.fromsmithy.Context;
import software.amazon.smithy.openapi.model.OperationObject;
import software.amazon.smithy.openapi.model.ParameterObject;
import software.amazon.smithy.openapi.model.Ref;
import software.amazon.smithy.openapi.model.RequestBodyObject;
import software.amazon.smithy.openapi.model.ResponseObject;

// Work around for AbstractRestProtocol not being public
public abstract class AbstractOSRestProtocol<T extends Trait> extends AbstractRestProtocol<T> {
    protected enum OSMessageType {
        REQUEST, RESPONSE, ERROR;

        static OSMessageType from(AbstractRestProtocol.MessageType messageType) {
            switch (messageType) {
                case REQUEST:
                    return REQUEST;
                case RESPONSE:
                    return RESPONSE;
                case ERROR:
                    return ERROR;
                default:
                    throw new IllegalArgumentException();
            }
        }
    }

    protected abstract String getDocumentMediaType(Context<T> context, Shape operationOrError, OSMessageType message);
    protected abstract Schema createDocumentSchema(
            Context<T> context,
            Shape operationOrError,
            List<HttpBinding> bindings,
            OSMessageType messageType
    );

    @Override
    protected abstract Node transformSmithyValueToProtocolValue(Node value);

    @Override
    String getDocumentMediaType(Context<T> context, Shape operationOrError, AbstractRestProtocol.MessageType messageType) {
        return getDocumentMediaType(context, operationOrError, OSMessageType.from(messageType));
    }

    @Override
    Schema createDocumentSchema(Context<T> context, Shape operationOrError, List<HttpBinding> bindings, MessageType messageType) {
        return createDocumentSchema(context, operationOrError, bindings, OSMessageType.from(messageType));
    }

    @Override
    public Optional<Operation> createOperation(Context<T> context, OperationShape operation) {
        ServiceShape serviceShape = context.getService();
        return operation.getTrait(HttpTrait.class).map(httpTrait -> {
            HttpBindingIndex bindingIndex = HttpBindingIndex.of(context.getModel());
            EventStreamIndex eventStreamIndex = EventStreamIndex.of(context.getModel());
            String method = context.getOpenApiProtocol().getOperationMethod(context, operation);
            String uri = context.getOpenApiProtocol().getOperationUri(context, operation);
            OperationObject.Builder builder = OperationObject.builder()
                    .operationId(serviceShape.getContextualName(operation));
            createPathParameters.apply(context, operation).forEach(builder::addParameter);
            createQueryParameters.apply(context, operation).forEach(builder::addParameter);
            createRequestHeaderParameters.apply(context, operation).forEach(builder::addParameter);
            createRequestBody(context, bindingIndex, eventStreamIndex, operation).ifPresent(builder::requestBody);
            createResponses(context, bindingIndex, eventStreamIndex, operation).forEach(builder::putResponse);
            return Operation.create(method, uri, builder);
        });
    }

    protected Optional<RequestBodyObject> createRequestBody(Context<T> context, HttpBindingIndex bindingIndex, EventStreamIndex eventStreamIndex, OperationShape operation) {
        List<HttpBinding> payloadBindings = bindingIndex.getRequestBindings(
                operation, HttpBinding.Location.PAYLOAD);

        // Get the default media type if one cannot be resolved.
        String documentMediaType = getDocumentMediaType(context, operation, MessageType.REQUEST);

        // Get the event stream media type if an event stream is in use.
        String eventStreamMediaType = eventStreamIndex.getInputInfo(operation)
                .map(info -> getEventStreamMediaType(context, info))
                .orElse(null);

        String mediaType = bindingIndex
                .determineRequestContentType(operation, documentMediaType, eventStreamMediaType)
                .orElse(null);

        if (payloadBindings.isEmpty()) {
            return createRequestDocument.apply(mediaType, context, bindingIndex, operation);
        }

        HttpBinding payloadBinding = payloadBindings.get(0);

        // WORKAROUND: Map list or map shapes to the document media type.
        // Needed until https://github.com/awslabs/smithy/pull/1840 is merged
        if (mediaType == null) {
            Shape targetShape = context.getModel().expectShape(payloadBinding.getMember().getTarget());
            if (targetShape.isListShape() || targetShape.isMapShape()) {
                mediaType = documentMediaType;
            }
        }

        return createRequestPayload.apply(mediaType, context, payloadBinding, operation);
    }

    protected Map<String, ResponseObject> createResponses(Context<T> context, HttpBindingIndex bindingIndex, EventStreamIndex eventStreamIndex, OperationShape operation) {
        Map<String, ResponseObject> result = new TreeMap<>();
        OperationIndex operationIndex = OperationIndex.of(context.getModel());
        StructureShape output = operationIndex.expectOutputShape(operation);
        updateResponsesMapWithResponseStatusAndObject(
                context, bindingIndex, eventStreamIndex, operation, output, result);

        for (StructureShape error : operationIndex.getErrors(operation)) {
            updateResponsesMapWithResponseStatusAndObject(
                    context, bindingIndex, eventStreamIndex, operation, error, result);
        }
        return result;
    }

    private void updateResponsesMapWithResponseStatusAndObject(
            Context<T> context,
            HttpBindingIndex bindingIndex,
            EventStreamIndex eventStreamIndex,
            OperationShape operation,
            StructureShape shape,
            Map<String, ResponseObject> responses
    ) {
        Shape operationOrError = shape.hasTrait(ErrorTrait.class) ? shape : operation;
        String statusCode = context.getOpenApiProtocol().getOperationResponseStatusCode(context, operationOrError);
        ResponseObject response = createResponse(
                context, bindingIndex, eventStreamIndex, statusCode, operationOrError, operation);
        responses.put(statusCode, response);
    }

    private ResponseObject createResponse(
            Context<T> context,
            HttpBindingIndex bindingIndex,
            EventStreamIndex eventStreamIndex,
            String statusCode,
            Shape operationOrError,
            OperationShape operation
    ) {
        ResponseObject.Builder responseBuilder = ResponseObject.builder();
        String contextName = context.getService().getContextualName(operationOrError);
        String responseName = stripNonAlphaNumericCharsIfNecessary.apply(context, contextName);
        responseBuilder.description(String.format("%s %s response", responseName, statusCode));
        createResponseHeaderParameters.apply(context, operationOrError, operation)
                .forEach((k, v) -> responseBuilder.putHeader(k, Ref.local(v)));
        addResponseContent(context, bindingIndex, eventStreamIndex, responseBuilder, operationOrError, operation);
        return responseBuilder.build();
    }

    private void addResponseContent(
            Context<T> context,
            HttpBindingIndex bindingIndex,
            EventStreamIndex eventStreamIndex,
            ResponseObject.Builder responseBuilder,
            Shape operationOrError,
            OperationShape operation
    ) {
        List<HttpBinding> payloadBindings = bindingIndex.getResponseBindings(
                operationOrError, HttpBinding.Location.PAYLOAD);

        // Get the default media type if one cannot be resolved.
        String documentMediaType = getDocumentMediaType(context, operationOrError, MessageType.RESPONSE);

        // Get the event stream media type if an event stream is in use.
        String eventStreamMediaType = eventStreamIndex.getOutputInfo(operationOrError)
                .map(info -> getEventStreamMediaType(context, info))
                .orElse(null);

        String mediaType = bindingIndex
                .determineResponseContentType(operationOrError, documentMediaType, eventStreamMediaType)
                .orElse(null);

        if (payloadBindings.isEmpty()) {
            createResponseDocumentIfNeeded.apply(mediaType, context, bindingIndex, responseBuilder,
                    operationOrError, operation);
            return;
        }

        HttpBinding payloadBinding = payloadBindings.get(0);

        // WORKAROUND: Map list or map shapes to the document media type.
        // Needed until https://github.com/awslabs/smithy/pull/1840 is merged
        if (mediaType == null) {
            Shape targetShape = context.getModel().expectShape(payloadBinding.getMember().getTarget());
            if (targetShape.isListShape() || targetShape.isMapShape()) {
                mediaType = documentMediaType;
            }
        }

        createResponsePayload.apply(mediaType, context, payloadBinding, responseBuilder, operationOrError, operation);
    }

    @SuppressWarnings("rawtypes")
    private final BiFunction<Context, OperationShape, List<ParameterObject>> createPathParameters = method("createPathParameters", Context.class, OperationShape.class);
    @SuppressWarnings("rawtypes")
    private final BiFunction<Context, OperationShape, List<ParameterObject>> createQueryParameters = method("createQueryParameters", Context.class, OperationShape.class);
    @SuppressWarnings("rawtypes")
    private final BiFunction<Context, OperationShape, Collection<ParameterObject>> createRequestHeaderParameters = method("createRequestHeaderParameters", Context.class, OperationShape.class);
    @SuppressWarnings("rawtypes")
    private final QuadFunction<String, Context, HttpBindingIndex, OperationShape, Optional<RequestBodyObject>> createRequestDocument = method("createRequestDocument", String.class, Context.class, HttpBindingIndex.class, OperationShape.class);
    @SuppressWarnings("rawtypes")
    private final QuadFunction<String, Context, HttpBinding, OperationShape, Optional<RequestBodyObject>> createRequestPayload = method("createRequestPayload", String.class, Context.class, HttpBinding.class, OperationShape.class);
    @SuppressWarnings("rawtypes")
    private final BiFunction<Context, String, String> stripNonAlphaNumericCharsIfNecessary = method("stripNonAlphaNumericCharsIfNecessary", Context.class, String.class);
    @SuppressWarnings("rawtypes")
    private final TriFunction<Context, Shape, OperationShape, Map<String, ParameterObject>> createResponseHeaderParameters = method("createResponseHeaderParameters", Context.class, Shape.class, OperationShape.class);
    @SuppressWarnings("rawtypes")
    private final HexFunction<String, Context, HttpBinding, ResponseObject.Builder, Shape, OperationShape, Void> createResponsePayload = method("createResponsePayload", String.class, Context.class, HttpBinding.class, ResponseObject.Builder.class, Shape.class, OperationShape.class);
    @SuppressWarnings("rawtypes")
    private final HexFunction<String, Context, HttpBindingIndex, ResponseObject.Builder, Shape, OperationShape, Void> createResponseDocumentIfNeeded = method("createResponseDocumentIfNeeded", String.class, Context.class, HttpBindingIndex.class, ResponseObject.Builder.class, Shape.class, OperationShape.class);

    @SuppressWarnings("SameParameterValue")
    private <U, V, R> BiFunction<U, V, R> method(String name, Class<U> uClass, Class<V> vClass) {
        Method m = getMethod(name, uClass, vClass);
        return (u, v) -> invoke(m, u, v);
    }

    @SuppressWarnings("SameParameterValue")
    private <U, V, W, R> TriFunction<U, V, W, R> method(String name, Class<U> uClass, Class<V> vClass, Class<W> wClass) {
        Method m = getMethod(name, uClass, vClass, wClass);
        return (u, v, w) -> invoke(m, u, v, w);
    }

    @SuppressWarnings("SameParameterValue")
    private <U, V, W, X, R> QuadFunction<U, V, W, X, R> method(String name, Class<U> uClass, Class<V> vClass, Class<W> wClass, Class<X> xClass) {
        Method m = getMethod(name, uClass, vClass, wClass, xClass);
        return (u, v, w, x) -> invoke(m, u, v, w, x);
    }

    @SuppressWarnings("SameParameterValue")
    private <U, V, W, X, Y, Z, R> HexFunction<U, V, W, X, Y, Z, R> method(String name, Class<U> uClass, Class<V> vClass, Class<W> wClass, Class<X> xClass, Class<Y> yClass, Class<Z> zClass) {
        Method m = getMethod(name, uClass, vClass, wClass, xClass, yClass, zClass);
        return (u, v, w, x, y, z) -> invoke(m, u, v, w, x, y, z);
    }

    private static Method getMethod(String name, Class<?>... args) {
        try {
            var m = AbstractRestProtocol.class.getDeclaredMethod(name, args);
            m.setAccessible(true);
            return m;
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    }

    private <Ret> Ret invoke(Method method, Object... args) {
        try {
            //noinspection unchecked
            return (Ret) method.invoke(this, args);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }

    @FunctionalInterface
    private interface TriFunction<U, V, W, R> {
        R apply(U u, V v, W w);
    }

    @FunctionalInterface
    private interface QuadFunction<U, V, W, X, R> {
        R apply(U u, V v, W w, X x);
    }

    @FunctionalInterface
    private interface HexFunction<U, V, W, X, Y, Z, R> {
        @SuppressWarnings("UnusedReturnValue")
        R apply(U u, V v, W w, X x, Y y, Z z);
    }
}
