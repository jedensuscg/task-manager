const { createLogger, format, transports, info } = require('winston');
const { combine, timestamp, label, prettyPrint, printf } = format;
const requestFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
})
const requestLogger = createLogger({
  format: combine(
    requestFormat,
    timestamp(),
    label({label: 'REQUEST'}),
    
  ),
  transports: [
    new transports.File({
      filename: 'requests.log',
      format: format.json()
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  requestLogger.clear().add(new transports.Console({
    format: format.simple()
  }),
  ),
  requestLogger.exceptions.handle(
    new transports.Console({ 
      format: format.simple()
     })
  );
}

const logger = createLogger({
  format: combine(
    label({label: "REQUEST"}),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new transports.File({
      filename: 'combined.log',
      format: format.json()
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.clear().add(new transports.Console({
    format: format.simple()
  }),
  ),
  logger.exceptions.handle(
    new transports.Console({ 
      format: format.simple()
     })
  );
}

module.exports = {logger, requestLogger}