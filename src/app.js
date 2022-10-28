const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const expressHttpContext = require("express-http-context");

const routes = require("./routes");
const {
  _httpContext,
  _httpResponseInterceptor,
} = require("./common/httpMiddleware");
const logger = require("./common/logger")("app");

app.set("trust proxy", true);
app.use(expressHttpContext.middleware);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(express.json({ limit: "10mb", type: ["text/*", "*/json"] }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(_httpContext);
app.use(_httpResponseInterceptor);
routes(app);
app.use(logger.requestLogger);
app.use(logger.responseLogger);

module.exports = app;
