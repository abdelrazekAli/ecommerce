const winston = require("winston");

const timezoned = () => {
  return new Date().toLocaleString();
};

const logger = winston.createLogger({
  transports: [
    //
    // - Write all logs with level `info` and below it to `error.log`
    //
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
