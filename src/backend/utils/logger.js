/**
 * Winston Logger Configuration
 * Provides structured logging for all LLM outputs and system events
 */

import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, "../../../logs/error.log"),
    level: "error",
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, "../../../logs/all.log"),
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Special logger for LLM interactions
export const llmLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../../../logs/llm-interactions.log"),
    }),
  ],
});

/**
 * Log LLM interaction for traceability
 * @param {string} operation - The operation being performed
 * @param {object} input - Input to the LLM
 * @param {object} output - Output from the LLM
 * @param {string} model - The LLM model used
 */
export const logLLMInteraction = (operation, input, output, model = "gemini") => {
  llmLogger.info("LLM Interaction", {
    operation,
    input,
    output,
    model,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log NAV analysis results
 * @param {string} documentId - Unique identifier for the document
 * @param {object} analysis - Analysis results
 * @param {object} anomalies - Detected anomalies
 */
export const logNAVAnalysis = (documentId, analysis, anomalies) => {
  logger.info("NAV Analysis Complete", {
    documentId,
    analysis,
    anomalies,
    timestamp: new Date().toISOString(),
  });
}; 