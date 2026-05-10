import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { CreateSurveyResponseAnswersBulkDto } from '../dto/CreateSurveyResponseAnswersBulk.dto';
import { CreateSurveyResponseAnswersResponse } from '../responses/CreateSurveyResponseAnswers.response';

/**
 * Documents the bulk create survey response answers endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiCreateSurveyResponseAnswersBulkDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Create survey response answers in bulk',
      description:
        'Creates answers for multiple survey fields in a single transaction.',
    }),
    ApiBody({ type: CreateSurveyResponseAnswersBulkDto }),
    ApiCreatedEnvelopeResponse({
      description: 'Survey response answers created successfully.',
      model: CreateSurveyResponseAnswersResponse,
      userMessage: 'respostas de survey criadas com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid bulk answer payload or business rule violation.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'answers',
                message: 'answers should not be empty',
              },
            ],
          },
        },
        duplicatedFieldInPayload: {
          summary: 'Duplicated field in payload',
          value: {
            message: 'Duplicated survey field answer in payload',
            userMessage: 'Campo respondido mais de uma vez na requisição',
            data: {
              fieldId: 10,
            },
          },
        },
        invalidFieldTypePayload: {
          summary: 'Invalid payload for field type',
          value: {
            message: 'Invalid answer payload for field type',
            userMessage: 'Resposta inválida para o tipo do campo',
            data: {
              fieldId: 10,
              type: 'SELECT',
            },
          },
        },
        answerAlreadyExists: {
          summary: 'Answer already exists',
          value: {
            message: 'Survey response answer already exists',
            userMessage: 'Campo já respondido para esta resposta de survey',
            data: {
              surveyResponseId: 1,
              fieldId: 10,
            },
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
    ApiNotFoundEnvelopeResponse({
      description: 'Referenced survey response was not found.',
      examples: {
        surveyResponseNotFound: {
          summary: 'Survey response not found',
          value: {
            message: 'Survey response not found',
            userMessage: 'Resposta de survey não encontrada',
            data: {
              surveyResponseId: 999,
            },
          },
        },
      },
    }),
  );
}
