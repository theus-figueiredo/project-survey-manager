import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequestEnvelopeResponse,
  ApiCreatedEnvelopeResponse,
  ApiNotFoundEnvelopeResponse,
  ApiUnauthorizedEnvelopeResponse,
} from '../../../common/swagger/ApiEnvelope.schema';
import { SurveyFieldTypesEnum } from '../../SurveyField/enums/SurveyFieldTypes.enum';
import { CreateSurveyDto } from '../dto/CreateSurvey.dto';
import { SurveyResponse } from '../responses/Survey.response';

/**
 * Documents the create survey endpoint.
 *
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiCreateSurveyDocs(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a survey',
      description:
        'Creates a survey with its fields and field options in a single request.',
    }),
    ApiBody({ type: CreateSurveyDto }),
    ApiCreatedEnvelopeResponse({
      description: 'Survey created successfully.',
      model: SurveyResponse,
      userMessage: 'survey criada com sucesso',
    }),
    ApiBadRequestEnvelopeResponse({
      description: 'Invalid survey creation payload or business rule.',
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            message: 'validation error',
            userMessage: 'erro de validação',
            data: [
              {
                field: 'title',
                message: 'title should not be empty',
              },
            ],
          },
        },
        projectRequired: {
          summary: 'Project is required for non-default surveys',
          value: {
            message: 'Project id is required for non-default surveys',
            userMessage: 'Projeto é obrigatório para surveys não padrão',
            data: null,
          },
        },
        optionsRequired: {
          summary: 'Options are required for this field type',
          value: {
            message: 'Survey field options are required for this field type',
            userMessage: 'Opções são obrigatórias para este tipo de campo',
            data: {
              type: SurveyFieldTypesEnum.SELECT,
              label: 'Como voce conheceu a empresa?',
            },
          },
        },
        optionsNotAllowed: {
          summary: 'Options are not allowed for this field type',
          value: {
            message: 'Survey field options are not allowed for this field type',
            userMessage: 'Opções não são permitidas para este tipo de campo',
            data: {
              type: SurveyFieldTypesEnum.TEXT,
              label: 'Nome completo',
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
      description: 'Referenced project was not found.',
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
      },
    }),
  );
}
