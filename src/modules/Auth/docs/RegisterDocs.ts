import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiConflictEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { RegisterDto } from '../dto/Register.dto';
import { RegisterResponse } from '../responses/Register.response';

/**
 * Documents the register endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiRegisterDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'Creates a new user with the provided data.',
    }),
    ApiBody({ type: RegisterDto }),
    ApiCreatedEnvelopeResponse({
      description: 'User registered successfully.',
      model: RegisterResponse,
      userMessage: 'usuario criado com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid register payload.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'position',
                message:
                  'position must be one of the following values: CONSULTANT, CUSTOMER',
              },
            ],
          },
        },
      },
    }),
    ApiConflictEnvelopeResponse({
      description: 'User registration conflicts with existing data.',
      examples: {
        emailAlreadyRegistered: {
          summary: 'Email already registered',
          value: {
            message: 'Email already registered',
            userMessage: 'Este email ja esta em uso',
            data: {
              email: 'admin.consultant@test.com',
            },
          },
        },
      },
    }),
  );
}
