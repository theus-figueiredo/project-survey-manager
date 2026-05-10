import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { LoginDto } from '../dto/Login.dto';
import { LoginResponse } from '../responses/Login.response';

/**
 * Documents the login endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiLoginDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Login a user',
      description:
        'Authenticates a user with email and password and returns a JWT token.',
    }),
    ApiBody({ type: LoginDto }),
    ApiCreatedEnvelopeResponse({
      description: 'User authenticated successfully.',
      model: LoginResponse,
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid login payload.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'email',
                message: 'email should not be empty',
              },
            ],
          },
        },
      },
    }),
    ApiUnauthorizedEnvelopeResponse({
      description: 'Authentication failed.',
      examples: {
        invalidCredentials: {
          summary: 'Invalid credentials',
          value: {
            message: 'Invalid credentials',
            userMessage: 'Email ou senha inválidos',
            data: null,
          },
        },
        tokenGenerationFailed: {
          summary: 'Token generation failed',
          value: {
            message: 'JWT secret is required',
            userMessage: 'Nao foi possivel gerar o token de autenticação',
            data: null,
          },
        },
      },
    }),
  );
}
