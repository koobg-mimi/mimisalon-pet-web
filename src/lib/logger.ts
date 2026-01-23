/**
 * Winston Logger Configuration
 *
 * Server-side only logger for structured logging to local filesystem.
 * Uses daily log rotation with automatic cleanup.
 *
 * @module lib/logger
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env } from './env';

// ============================================================================
// Configuration (Lazy Initialization)
// ============================================================================

// Lazy getters for configuration to prevent build-time errors
const getLogDir = () => env.LOG_DIR;
const getLogLevel = () => env.LOG_LEVEL;
const getLogMaxSize = () => env.LOG_MAX_SIZE;
const getLogMaxFiles = () => env.LOG_MAX_FILES;

// ============================================================================
// Custom Log Format
// ============================================================================

/**
 * Custom format for structured JSON logging
 */
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['timestamp', 'level', 'message'] }),
  winston.format.json()
);

/**
 * Custom format for console output (development)
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;

    // Add metadata if present
    if (Object.keys(metadata).length > 0) {
      msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return msg;
  })
);

// ============================================================================
// Lazy Logger Initialization
// ============================================================================

let _logger: winston.Logger | null = null;

/**
 * Get or create the Winston logger instance (lazy initialization)
 * This prevents build-time errors when environment variables are not available
 */
function getLogger(): winston.Logger {
  if (!_logger) {
    const LOG_DIR = getLogDir();
    const LOG_LEVEL = getLogLevel();
    const LOG_MAX_SIZE = getLogMaxSize();
    const LOG_MAX_FILES = getLogMaxFiles();

    /**
     * Daily rotate file transport for error logs
     */
    const errorFileTransport = new DailyRotateFile({
      filename: path.join(LOG_DIR, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
      format: jsonFormat,
      zippedArchive: true,
    });

    /**
     * Daily rotate file transport for combined logs
     */
    const combinedFileTransport = new DailyRotateFile({
      filename: path.join(LOG_DIR, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
      format: jsonFormat,
      zippedArchive: true,
    });

    /**
     * Daily rotate file transport for network error logs
     */
    const networkFileTransport = new DailyRotateFile({
      filename: path.join(LOG_DIR, 'network-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
      format: winston.format.combine(
        winston.format((info: winston.Logform.TransformableInfo) => {
          return info.type === 'NETWORK_ERROR' ? info : false;
        })(),
        jsonFormat
      ),
      zippedArchive: true,
    });

    /**
     * Console transport for development
     */
    const consoleTransport = new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    });

    _logger = winston.createLogger({
      level: LOG_LEVEL,
      format: jsonFormat,
      defaultMeta: {
        service: 'mimisalon-nextjs',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: [
        errorFileTransport,
        combinedFileTransport,
        networkFileTransport,
        consoleTransport,
      ],
      exceptionHandlers: [
        new DailyRotateFile({
          filename: path.join(LOG_DIR, 'exceptions-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: LOG_MAX_SIZE,
          maxFiles: LOG_MAX_FILES,
          format: jsonFormat,
        }),
      ],
      rejectionHandlers: [
        new DailyRotateFile({
          filename: path.join(LOG_DIR, 'rejections-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: LOG_MAX_SIZE,
          maxFiles: LOG_MAX_FILES,
          format: jsonFormat,
        }),
      ],
    });
  }

  return _logger;
}

// Proxy to maintain API compatibility
const logger = new Proxy({} as winston.Logger, {
  get(_, prop) {
    return (getLogger() as any)[prop];
  },
});

// ============================================================================
// Convenience Methods
// ============================================================================

/**
 * Log network error from client
 */
export const logNetworkError = (error: {
  url: string;
  method: string;
  statusCode?: number;
  message: string;
  userId?: string;
  sessionId?: string;
  browser?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}) => {
  logger.error(error.message, {
    type: 'NETWORK_ERROR',
    ...error,
  });
};

/**
 * Log API error
 */
export const logApiError = (
  endpoint: string,
  error: Error | unknown,
  context?: Record<string, any>
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error(errorMessage, {
    type: 'API_ERROR',
    endpoint,
    stack: errorStack,
    ...context,
  });
};

/**
 * Log authentication error
 */
export const logAuthError = (
  action: string,
  error: Error | unknown,
  userId?: string,
  context?: Record<string, any>
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  logger.error(errorMessage, {
    type: 'AUTH_ERROR',
    action,
    userId,
    ...context,
  });
};

/**
 * Log info message
 */
export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info(message, context);
};

/**
 * Log warning
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  logger.warn(message, context);
};

/**
 * Log debug message (development only)
 */
export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug(message, context);
};

// ============================================================================
// Export
// ============================================================================

export default logger;
