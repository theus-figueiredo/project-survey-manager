import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiOkEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { UpdateSurveyDto } from '../dto/UpdateSurvey.dto';
import { SurveyResponse } from '../responses/Survey.response';

/**
 * Documents the update survey endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiUpdateSurveyDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a survey',
      description: 'Updates only the survey fields received in the request body.',
    }),
    ApiBody({ type: UpdateSurveyDto }),
    ApiOkEnvelopeResponse({
      description: 'Survey updated successfully.',
      model: SurveyResponse,
      userMessage: 'survey atualizada com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid survey update payload.',
      examples: {
        emptyPayload: {
          summary: 'No update fields',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'updateFields',
                message: 'provide at least one survey field to update',
              },
            ],
          },
        },
        projectCannotBeRemoved: {
          summary: 'Project cannot be removed from non-default survey',
          value: {
            message: 'Project cannot be removed from non-default survey',
            userMessage: 'Projeto não pode ser removido de uma survey não padrão',
            data: null,
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
      description: 'Authenticated user does not have permission to update surveys.',
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
      description: 'Survey or referenced project was not found.',
      examples: {
        surveyNotFound: {
          summary: 'Survey not found',
          value: {
            message: 'Survey not found',
            userMessage: 'Survey não encontrada',
            data: { id: 999 },
          },
        },
        projectNotFound: {
          summary: 'Project not found',
          value: {
            message: 'Project not found',
            userMessage: 'Projeto não encontrado',
            data: { projectId: 999 },
          },
        },
      },
    }),
  );
}
