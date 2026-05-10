import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseApiException } from '../errors/BaseApi.exception';
import { ApiResponse } from '../responses/ApiResponse';

/**
 * Global exception filter responsible for serializing API errors consistently.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  /**
   * Handles thrown exceptions and formats them as ApiResponse.
   *
   * @param {unknown} exception - The thrown exception.
   * @param {ArgumentsHost} host - The current arguments host.
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof BaseApiException) {
      response
        .status(exception.getStatus())
        .json(
          ApiResponse.error(
            exception.message,
            exception.userMessage,
            exception.data,
          ),
        );
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'internal server error'
        : 'request error';

    const userMessage =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'erro interno do servidor'
        : 'erro na requisição';

    response.status(status).json(ApiResponse.error(message, userMessage, null));
  }
}
