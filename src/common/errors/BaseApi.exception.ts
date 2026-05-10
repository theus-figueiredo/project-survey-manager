import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base class for custom API exceptions that must be serialized as ApiResponse.
 */
export class BaseApiException extends HttpException {
  /**
   * BaseApiException constructor.
   *
   * @param {string} message - Technical error message.
   * @param {string} userMessage - User-facing error message.
   * @param {unknown} data - Error payload.
   * @param {HttpStatus} statusCode - HTTP status code to return.
   */
  public constructor(
    public readonly message: string,
    public readonly userMessage: string,
    public readonly data: unknown,
    protected readonly statusCode: HttpStatus,
  ) {
    super({ message, userMessage, data }, statusCode);
  }
}
