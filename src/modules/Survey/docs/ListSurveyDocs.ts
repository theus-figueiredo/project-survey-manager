import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiOkArrayEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { ListSurveyResponse } from '../responses/ListSurvey.response';

/**
 * Documents the list survey endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiListSurveyDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'List surveys',
      description: 'Lists surveys by default flag or project id.',
    }),
    ApiQuery({
      name: 'default',
      type: Boolean,
      required: false,
      description: 'When true, lists default surveys.',
    }),
    ApiQuery({
      name: 'projectId',
      type: Number,
      required: false,
      description: 'Project id used to list surveys associated with a project.',
    }),
    ApiOkArrayEnvelopeResponse({
      description: 'Surveys found successfully.',
      model: ListSurveyResponse,
      userMessage: 'surveys encontradas com sucesso',
      dataExample: [
        {
          id: 1,
          title: 'Pesquisa de onboarding',
          default: false,
          project: {
            id: 1,
            name: 'EYF Onboarding',
          },
          fields: [
            {
              id: 1,
              type: 'SELECT',
              label: 'Como voce conheceu a empresa?',
              placeholder: null,
              required: true,
              order: 1,
              options: [
                {
                  id: 1,
                  value: 'Google',
                  order: 1,
                },
              ],
            },
          ],
          createdAt: '2026-04-12T12:00:00.000Z',
          updatedAt: '2026-04-12T12:00:00.000Z',
        },
      ],
    }),
    ApiNoContentResponse({
      description: 'No surveys found.',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid survey list query.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'filters',
                message:
                  'provide default=true, projectId, or default=false with projectId',
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
  );
}
