import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiOkEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { SurveyResponse } from '../responses/Survey.response';

/**
 * Documents the get survey endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiGetSurveyDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a survey',
      description:
        'Retrieves a survey with its project, creator, fields, and field options. When withResponse is true, field answers from the survey response linked to the survey are included.',
    }),
    ApiQuery({
      name: 'id',
      type: Number,
      required: true,
      description: 'Survey id to retrieve.',
    }),
    ApiQuery({
      name: 'withResponse',
      type: Boolean,
      required: false,
      description:
        'When true, loads answers from the survey response linked to the survey.',
    }),
    ApiOkEnvelopeResponse({
      description: 'Survey found successfully.',
      model: SurveyResponse,
      userMessage: 'survey encontrada com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid survey lookup query.',
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
    ApiNotFoundEnvelopeResponse({
      description: 'Survey was not found.',
      examples: {
        surveyNotFound: {
          summary: 'Survey not found',
          value: {
            message: 'Survey not found',
            userMessage: 'Survey não encontrada',
            data: {
              id: 999,
            },
          },
        },
        surveyResponseNotFound: {
          summary: 'Survey response not found',
          value: {
            message: 'Survey response not found',
            userMessage: 'Resposta de survey não encontrada',
            data: {
              surveyId: 999,
            },
          },
        },
      },
    }),
  );
}
