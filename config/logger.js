const winston = require("winston");

// Set timezone to local
const timezoned = () => {
  return new Date().toLocaleString();
};

// Write all logs with level `info` and below it to `payment.log`
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "payment.log",
      datePattern: "YYYY-MM-DD-HH",
      format: winston.format.combine(
        winston.format.timestamp({ format: timezoned }),
        winston.format.json()
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
