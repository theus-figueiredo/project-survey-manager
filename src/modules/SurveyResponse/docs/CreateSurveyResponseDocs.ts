import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { CreateSurveyResponseDto } from '../dto/CreateSurveyResponse.dto';
import { SurveyResponseResponse } from '../responses/SurveyResponse.response';

/**
 * Documents the create survey response endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiCreateSurveyResponseDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a survey response',
      description:
        'Creates only the main survey response submission record without answers.',
    }),
    ApiBody({ type: CreateSurveyResponseDto }),
    ApiCreatedEnvelopeResponse({
      description: 'Survey response created successfully.',
      model: SurveyResponseResponse,
      userMessage: 'resposta de survey criada com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid survey response creation payload.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'surveyId',
                message: 'surveyId must be a positive number',
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
      description: 'Referenced survey was not found.',
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
      },
    }),
  );
}
