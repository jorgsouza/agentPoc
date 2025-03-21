export class ApplicationError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

export class DomainError extends ApplicationError {
  constructor(message, details = {}) {
    super(message, 'DOMAIN_ERROR', details);
  }
}

export class InfrastructureError extends ApplicationError {
  constructor(message, details = {}) {
    super(message, 'INFRASTRUCTURE_ERROR', details);
  }
}

export class ErrorHandler {
  static handle(error, logger = console) {
    if (error instanceof ApplicationError) {
      logger.error(`[${error.code}] ${error.message}`, error.details);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      };
    }

    // Handle unexpected errors
    logger.error('[UNEXPECTED_ERROR]', error);
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred'
      }
    };
  }
}
