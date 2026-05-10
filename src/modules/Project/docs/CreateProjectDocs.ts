import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { ProjectPhasesEnum } from '../enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../enums/ProjectStatus.enum';
import { CreateProjectDto } from '../dto/CreateProject.dto';
import { ProjectResponse } from '../responses/Project.response';

/**
 * Documents the create project endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiCreateProjectDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a project',
      description:
        'Creates a project and duplicates all default surveys into the new project.',
    }),
    ApiBody({ type: CreateProjectDto }),
    ApiCreatedEnvelopeResponse({
      description: 'Project created successfully.',
      model: ProjectResponse,
      userMessage: 'sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid project creation payload.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'name',
                message: 'name should not be empty',
              },
              {
                field: 'phase',
                message: `phase must be one of the following values: ${Object.values(ProjectPhasesEnum).join(', ')}`,
              },
              {
                field: 'status',
                message: `status must be one of the following values: ${Object.values(ProjectStatusEnum).join(', ')}`,
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
      description: 'Authenticated user does not have permission to create projects.',
      examples: {
        forbiddenResource: {
          summary: 'Forbidden resource',
          value: {
            message: 'Forbidden action',
            userMessage: 'Ação proíbida',
            data: null,
          },
        },
      },
    }),
    ApiNotFoundEnvelopeResponse({
      description: 'Referenced project leader or project was not found.',
      examples: {
        projectLeaderNotFound: {
          summary: 'Project leader not found',
          value: {
            message: 'Project leader not found',
            userMessage: 'Líder do projeto não encontrado',
            data: {
              projectLeaderId: 999,
            },
          },
        },
        projectNotFound: {
          summary: 'Project not found while duplicating default surveys',
          value: {
            message: 'Project not found',
            userMessage: 'Projeto não encontrado',
            data: {
              projectId: 999,
            },
          },
        },
      },
    }),
  );
}
