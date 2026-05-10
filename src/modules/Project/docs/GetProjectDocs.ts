import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiOkEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { ProjectResponse } from '../responses/Project.response';

/**
 * Documents the get project endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiGetProjectDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Get project by id',
      description: 'Retrieves a project with its project leader.',
    }),
    ApiQuery({
      name: 'id',
      type: Number,
      required: true,
      description: 'Project id to retrieve.',
    }),
    ApiOkEnvelopeResponse({
      description: 'Project found successfully.',
      model: ProjectResponse,
      userMessage: 'sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid project lookup query.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'id',
                message: 'id must be a positive number',
              },
            ],
          },
        },
      },
    }),
    ApiUnauthorizedEnvelopeResponse({
      description: 'Authentication token is missing or invalid.',
      examples: {
        missingBearerToken: {
          summary: 'Missing Bearer token',
          value: {
            message: 'Missing Bearer token',
            userMessage: 'Token de autenticação não informado',
            data: null,
          },
        },
        invalidToken: {
          summary: 'Invalid token',
          value: {
            message: 'Unauthorized',
            userMessage: 'Token de autenticação inválido',
            data: null,
          },
        },
      },
    }),
    ApiForbiddenEnvelopeResponse({
      description: 'Authenticated user does not have permission to get projects.',
      examples: {
        forbiddenAction: {
          summary: 'Forbidden action',
          value: {
            message: 'Forbidden action',
            userMessage: 'Ação proíbida',
            data: null,
          },
        },
      },
    }),
    ApiNotFoundEnvelopeResponse({
      description: 'Project was not found.',
      examples: {
        projectNotFound: {
          summary: 'Project not found',
          value: {
            message: 'Project not found',
            userMessage: 'Projeto não encontrado',
            data: {
              id: 999,
            },
          },
        },
      },
    }),
  );
}
