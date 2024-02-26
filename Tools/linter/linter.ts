import OpenApiValidator from "./OpenApiValidator";


async function lint() {
    await OpenApiValidator.validate();
}

lint();