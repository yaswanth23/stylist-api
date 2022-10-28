const winston = require("winston");
const winstonRotator = require("winston-daily-rotate-file");
const httpContext = require("express-http-context");
const mung = require("express-mung");
const colors = require("colors/safe");
const Os = require("os");
const logLevel = 0;

const consoleLogger = new winston.transports.Console({
  level: logLevel,
  handleExceptions: true,
  colorize: true,
});

const parseError = (errorData) => {
  if (errorData.message || (errorData.message && errorData.stack)) {
    return JSON.stringify({
      error: errorData.message,
      stack: errorData.stack || "",
    });
  }
  return JSON.stringify(errorData);
};

const normalizeModuleName = (name) => {
  if (name === "undefined" || name === undefined || name === "null") {
    return normalizeModuleName("unknown");
  }
  const name_length = name.length;
  const require_length = 20;
  let result = name;
  if (name_length == require_length) {
    result = name;
  }
  if (name_length > require_length) {
    result = name.substring(
      0,
      name.length - (name_length - require_length) - 1
    );
  }
  if (require_length > name_length) {
    result = name.padEnd(require_length - name_length + name.length - 1, ".");
  }
  return result;
};

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
    winston.format.printf((info) => {
      switch (info.level) {
        case "info":
          return `${colors.cyan(colors.bold(info.level))}      | ${colors.cyan(
            normalizeModuleName(info.module)
          )} | ${info.timestamp} | ${
            httpContext.get("request_id") || "no-request-id"
          } | ${JSON.stringify(info.message)}`;
        case "debug":
          return `${colors.magenta(
            colors.bold(info.level)
          )}     | ${colors.magenta(normalizeModuleName(info.module))} | ${
            info.timestamp
          } | ${
            httpContext.get("request_id") || "no-request-id"
          } | ${JSON.stringify(info.message)}`;
        case "error":
          return `${colors.bgRed(colors.black(info.level))}     | ${colors.red(
            normalizeModuleName(info.module)
          )} | ${info.timestamp} | ${
            httpContext.get("request_id") || "no-request-id"
          }  | ${parseError(info.message)}`;
        case "warn":
          return `${colors.bgYellow(
            colors.black(info.level)
          )}      | ${colors.yellow(normalizeModuleName(info.module))} | ${
            httpContext.get("request_id") || "no-request-id"
          }  | ${info.timestamp} | ${JSON.stringify(info.message)}`;
        default:
          return `${colors.bgBlue(info.level)}     | ${colors.blue(
            normalizeModuleName(info.module)
          )} | ${info.timestamp} | ${
            httpContext.get("request_id") || "no-request-id"
          }  | ${JSON.stringify(info.message)}`;
      }
    })
  ),
  transports: [
    consoleLogger,
    new winston.transports.DailyRotateFile({
      name: "access-file",
      level: "info",
      filename: Os.homedir() + "/var/logs/sty-dev/sty-dev-info.log",
      json: false,
      datePattern: "yyyy-MM-DD",
      prepend: true,
      maxFiles: 10,
    }),
    new winston.transports.DailyRotateFile({
      name: "error-file",
      level: "error",
      filename: Os.homedir() + "/var/logs/sty-dev/sty-dev-error.log",
      json: false,
      datePattern: "yyyy-MM-DD",
      prepend: true,
      maxFiles: 10,
    }),
  ],
});

module.exports = function (module = null) {
  return {
    debug(...args) {
      args.forEach((x) => {
        logger.debug(x, { module });
      });
    },
    info(...args) {
      args.forEach((x) => {
        logger.info(x, { module });
      });
    },
    error(...args) {
      args.forEach((x) => {
        logger.error(x, { module });
      });
    },
    warn(...args) {
      args.forEach((x) => {
        logger.warn(x, { module });
      });
    },
    formats: {
      success(message) {
        return `${message}`;
      },
    },
    requestLogger(req, res, next) {
      logger.info(`${req.hostname}${req.port || ""}${req.originalUrl}`);
      next();
    },
    responseLogger(req, res, next) {
      return mung.json(function transform(body, req, res) {
        const api = `https://${process.env.APP_PUBLIC}${
          req.originalUrl
        }`;
        logger.debug({
          api,
          module,
          request_ts: req.request_timestamp,
          conversation_id: httpContext.get("request_id") || req.conversation_id,
          payload: req.body,
          headers: req.headers,
        });
        return body;
      });
    },
  };
};
