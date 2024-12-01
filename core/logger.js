const winston = require('winston');

// Load logging level from config.json
const config = require('../config/config.json');

// Create a logger with console and file transports
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || config.logLevel || 'info',  // Log level (can be 'debug', 'info', 'warn', 'error')
  transports: [
    // Console log
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File log
    new winston.transports.File({
      filename: 'app.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

module.exports = exports = logger;
