import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiOkEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { UpdateSurveyFieldOptionDto } from '../dto/UpdateSurveyFieldOption.dto';
import { SurveyFieldOptionResponse } from '../responses/SurveyFieldOption.response';

/**
 * Documents the update survey field option endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiUpdateSurveyFieldOptionDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a survey field option',
      description:
        'Updates only the survey field option properties received in the request body.',
    }),
    ApiBody({ type: UpdateSurveyFieldOptionDto }),
    ApiOkEnvelopeResponse({
      description: 'Survey field option updated successfully.',
      model: SurveyFieldOptionResponse,
      userMessage: 'opção do campo da survey atualizada com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid survey field option update payload.',
      examples: {
        emptyPayload: {
          summary: 'No update fields',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'updateFields',
                message:
                  'provide at least one survey field option property to update',
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
        'Authenticated user does not have permission to update survey field options.',
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
      description: 'Survey field option was not found.',
      examples: {
        surveyFieldOptionNotFound: {
          summary: 'Survey field option not found',
          value: {
            message: 'Survey field option not found',
            userMessage: 'Opção do campo da survey não encontrada',
            data: { id: 999 },
          },
        },
      },
    }),
  );
}
