import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiOkEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { ProjectPhasesEnum } from '../enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../enums/ProjectStatus.enum';
import { ListProjectResponse } from '../responses/ListProject.response';

/**
 * Documents the list project endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiListProjectDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'List projects',
      description:
        'Lists projects using filters and pagination. When all=true, filters are ignored and pagination is still applied.',
    }),
    ApiQuery({
      name: 'customer',
      type: String,
      required: false,
      description: 'Client name used to filter projects.',
    }),
    ApiQuery({
      name: 'projectLeaderId',
      type: Number,
      required: false,
      description: 'Project leader id used to filter projects.',
    }),
    ApiQuery({
      name: 'phase',
      enum: ProjectPhasesEnum,
      required: false,
      description: 'Project phase used to filter projects.',
    }),
    ApiQuery({
      name: 'status',
      enum: ProjectStatusEnum,
      required: false,
      description: 'Project status used to filter projects.',
    }),
    ApiQuery({
      name: 'all',
      type: Boolean,
      required: false,
      description: 'When true, ignores filters but keeps pagination.',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'Page number used for pagination.',
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Number of items returned per page.',
    }),
    ApiOkEnvelopeResponse({
      description: 'Projects found successfully.',
      model: ListProjectResponse,
      userMessage: 'projetos encontrados com sucesso',
    }),
    ApiNoContentResponse({
      description: 'No projects found for the provided query.',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid project list query.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'page',
                message: 'page must be a positive number',
              },
              {
                field: 'phase',
                message: `phase must be one of the following values: ${Object.values(ProjectPhasesEnum).join(', ')}`,
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
      description: 'Authenticated user does not have permission to list projects.',
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
  );
}
