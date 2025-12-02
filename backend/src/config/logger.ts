// src/config/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: "info", // nivel mínimo que se loguea
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ""
      }`;
    })
  ),
  transports: [
    new winston.transports.Console(), // imprime en consola
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
