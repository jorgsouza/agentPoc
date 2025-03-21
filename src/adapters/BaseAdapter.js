import { InfrastructureError } from '../infrastructure/errors/ErrorHandler.js';

export class BaseAdapter {
  constructor(config) {
    this.config = config;
  }

  async executeRequest(operation) {
    try {
      return await operation();
    } catch (error) {
      throw new InfrastructureError(
        `External service error: ${error.message}`,
        {
          originalError: error.message,
          service: this.constructor.name
        }
      );
    }
  }
}
