const httpContext = require("express-http-context");
const logger = require("../common/logger")("http-helper");
const { v4: UUID } = require("uuid");
/*
 **
 * @param httpResponse *router response object
 * @param data defaults to {}
 * @return json 200
 */
module.exports._200 = (httpResponse, data = {}) => {
  const response_data = {
    status: "success",
    data: data,
  };
  return httpResponse.status(200).json(response_data);
};

/*
 **
 * @param httpResponse *router response object
 * @param error exception object
 * @param next optional function
 * @return json error response object { status, request_id, code, message, errors, trace }
 */
module.exports._error = (httpResponse, error, next) => {
  try {
    let errors =
      error.errors && Array.isArray(error.errors) && error.errors.length > 0
        ? []
        : undefined;
    let [code, message, statusCode, request_id, trace] = [
      error.code || "SERVICE_ERROR",
      error.message ||
        "An unexpected error has happened on the server while resolving your request.",
      500,
      httpContext.get("request_id") || undefined,
      process.env.APP_ENV === "development" || process.env.APP_ENV === "local"
        ? error.stack
        : undefined,
    ];
    switch (error.type) {
      case "validation":
        statusCode = 403;
        break;
      case "generic":
        statusCode = 500;
        break;
      case "business":
        statusCode = 500;
        break;
      case "authorization":
        statusCode = 401;
        break;
    }
    if (error.errors && error.errors.length > 0) {
      for (const e of error.errors) {
        if (typeof error === "string") {
          errors.push(e);
        } else {
          errors.push(e.message);
        }
      }
    }
    let response = {
      status: "error",
      request_id,
      code,
      message,
      errors,
      trace,
    };
    httpResponse.status(statusCode).json(response);
    if (next) next();
  } catch (e) {
    httpResponse.status(500).json({
      status: "error",
      code: "SERVICE_ERROR",
      message:
        "An unexpected error has happened on the server while resolving your request.",
      trace:
        process.env.APP_ENV === "development" || process.env.APP_ENV === "local"
          ? error.stack
          : undefined,
    });
    if (next) next();
  }
};

/*
 **
 * @param httpRequest *router request object
 * @param httpResponse *router response object
 */
module.exports._404 = (httpRequest, httpResponse) => {
  httpResponse.status(404).json({
    status: "error",
    message: "The resource you are looking for is not found on the server",
    code: "RESOURCE_NOT_FOUND",
  });
};

module.exports._genRID = () => {
  return UUID();
};
