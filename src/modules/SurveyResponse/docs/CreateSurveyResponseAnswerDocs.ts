import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { CreateSurveyResponseAnswerDto } from '../dto/CreateSurveyResponseAnswer.dto';
import { CreateSurveyResponseAnswersResponse } from '../responses/CreateSurveyResponseAnswers.response';

/**
 * Documents the create survey response answer endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiCreateSurveyResponseAnswerDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a survey response answer',
      description:
        'Creates answers for a single survey field. CHECKBOX fields create one row per selected option.',
    }),
    ApiBody({ type: CreateSurveyResponseAnswerDto }),
    ApiCreatedEnvelopeResponse({
      description: 'Survey response answers created successfully.',
      model: CreateSurveyResponseAnswersResponse,
      userMessage: 'respostas de survey criadas com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid answer payload or business rule violation.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'surveyResponseId',
                message: 'surveyResponseId must be a positive number',
              },
            ],
          },
        },
        invalidFieldTypePayload: {
          summary: 'Invalid payload for field type',
          value: {
            message: 'Invalid answer payload for field type',
            userMessage: 'Resposta inválida para o tipo do campo',
            data: {
              fieldId: 10,
              type: 'TEXT',
            },
          },
        },
        optionDoesNotBelongToField: {
          summary: 'Option does not belong to field',
          value: {
            message: 'Survey field option does not belong to survey field',
            userMessage: 'Opção não pertence ao campo informado',
            data: {
              fieldId: 12,
              optionId: 99,
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
