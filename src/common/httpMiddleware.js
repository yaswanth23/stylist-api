const expressHttpContext = require("express-http-context");
const mung = require("express-mung");
const { DateTime } = require("luxon");
const { v4: UUID } = require("uuid");
const { _genRID } = require("./httpHelper");
const logger = require("./logger")("http-middleware");
/*
 **
 * @param httpRequest *router request object
 * @param httpResponse *router response object
 * @return next function
 */
module.exports._httpContext = (httpRequest, httpResponse, next) => {
  const [request_id, request_ts] = [_genRID(), new Date(Date.now()).toJSON()];
  expressHttpContext.set("request_id", request_id);
  httpRequest.context = { request_id, request_ts };
  logger.info(
    `${httpRequest.hostname}${httpRequest.port || ""}${httpRequest.originalUrl}`
  );
  next();
};

/*
 **
 * @param httpRequest *router request object
 * @param httpResponse *router response object
 * @return next function
 */
module.exports._httpResponseInterceptor = mung.json(function transform(
  body,
  httpRequest,
  httpResponse
) {
  const request_ts_utc = DateTime.fromISO(
    httpRequest.context.request_ts
  ).toUTC();
  const response_ts_utc = DateTime.now().toUTC();
  const response_ts = response_ts_utc
    .diff(request_ts_utc, ["milliseconds"])
    .toObject().milliseconds;
  const meta = {
    request_id: httpRequest.context.request_id,
    response_ts,
  };
  body["meta"] = meta;
  logger.debug(body);
  return body;
});
