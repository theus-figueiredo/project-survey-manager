import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiForbiddenEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiOkEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { UpdateSurveyFieldDto } from '../dto/UpdateSurveyField.dto';
import { SurveyFieldResponse } from '../responses/SurveyField.response';

/**
 * Documents the update survey field endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiUpdateSurveyFieldDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a survey field',
      description:
        'Updates only the survey field properties received in the request body.',
    }),
    ApiBody({ type: UpdateSurveyFieldDto }),
    ApiOkEnvelopeResponse({
      description: 'Survey field updated successfully.',
      model: SurveyFieldResponse,
      userMessage: 'campo da survey atualizado com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid survey field update payload.',
      examples: {
        emptyPayload: {
          summary: 'No update fields',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'updateFields',
                message: 'provide at least one survey field property to update',
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
        'Authenticated user does not have permission to update survey fields.',
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
      description: 'Survey field was not found.',
      examples: {
        surveyFieldNotFound: {
          summary: 'Survey field not found',
          value: {
            message: 'Survey field not found',
            userMessage: 'Campo da survey não encontrado',
            data: { id: 999 },
          },
        },
      },
    }),
  );
}
