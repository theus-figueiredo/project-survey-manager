import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { AddUsersToProjectDto } from '../dto/AddUsersToProject.dto';
import { ProjectWithUsersResponse } from '../responses/ProjectWithUsers.response';

/**
 * Documents the add users to project endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiAddUsersToProjectDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Add users to a project',
      description:
        'Adds users to a project without removing existing user associations.',
    }),
    ApiBody({ type: AddUsersToProjectDto }),
    ApiCreatedEnvelopeResponse({
      description: 'Users added to project successfully.',
      model: ProjectWithUsersResponse,
      userMessage: 'usuários adicionados ao projeto com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid project add users payload.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'userIds',
                message: 'userIds should not be empty',
              },
            ],
          },
        },
      },
    }),
    ApiUnauthorizedEnvelopeResponse({
      description: 'Authentication token is missing or invalid.',
      examples: {
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
      description:
        'Authenticated user does not have permission to add users to projects.',
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
      description: 'Project or users were not found.',
      examples: {
        projectNotFound: {
          summary: 'Project not found',
          value: {
            message: 'Project not found',
            userMessage: 'Projeto não encontrado',
            data: {
              projectId: 999,
            },
          },
        },
        usersNotFound: {
          summary: 'Users not found',
          value: {
            message: 'Users not found',
            userMessage: 'Usuários não encontrados',
            data: {
              userIds: [999],
            },
          },
        },
      },
    }),
  );
}
