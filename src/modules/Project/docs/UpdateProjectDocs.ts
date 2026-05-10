import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiOkEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { ProjectPhasesEnum } from '../enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../enums/ProjectStatus.enum';
import { UpdateProjectDto } from '../dto/UpdateProject.dto';
import { ProjectResponse } from '../responses/Project.response';

/**
 * Documents the update project endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiUpdateProjectDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a project',
      description:
        'Updates only the project fields received in the request body.',
    }),
    ApiBody({ type: UpdateProjectDto }),
    ApiOkEnvelopeResponse({
      description: 'Project updated successfully.',
      model: ProjectResponse,
      userMessage: 'projeto atualizado com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid project update payload.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
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
        emptyPayload: {
          summary: 'No update fields',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'updateFields',
                message: 'provide at least one project field to update',
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
      description: 'Authenticated user does not have permission to update projects.',
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
      description: 'Project or referenced project leader was not found.',
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
      },
    }),
  );
}
