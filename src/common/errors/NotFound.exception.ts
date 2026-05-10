import { HttpStatus } from '@nestjs/common';
import { BaseApiException } from './BaseApi.exception';

/**
 * Exception thrown when a requested resource cannot be found.
 */
export class NotFoundException extends BaseApiException {
  /**
   * NotFoundException constructor.
   *
   * @param {string} message - Technical error message.
   * @param {string} userMessage - User-facing error message.
   * @param {unknown} data - Error payload.
   */
  public constructor(message: string, userMessage: string, data: unknown) {
    super(message, userMessage, data, HttpStatus.NOT_FOUND);
  }
}
