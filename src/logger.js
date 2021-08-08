const { createLogger, format, transports, info } = require("winston");
const { combine, timestamp, label, prettyPrint, printf } = format;
const logFormat = printf(({ timestamp, level, message, label }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const requestLogger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({
      filename: "requests.log",
      format: format.json(),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  requestLogger.clear().add(
    new transports.Console({
      format: format.simple(),
    })
  ),
    requestLogger.exceptions.handle(
      new transports.Console({
        format: format.simple(),
      })
    );
}

const logger = createLogger({
  format: combine(logFormat, timestamp()),
  transports: [
    new transports.File({
      filename: "combined.log",
      format: format.json(),
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.clear().add(
    new transports.Console({
      format: format.simple(),
    })
  ),
    logger.exceptions.handle(
      new transports.Console({
        format: format.simple(),
      })
    );
}

module.exports = { logger, requestLogger };
