import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

type ApiEnvelopeOptions = {
  description: string;
  model: Type<unknown>;
  userMessage?: string;
  dataExample?: unknown;
};

type ApiEnvelopeExample = {
  message: string;
  userMessage: string;
  data: unknown;
};

type ApiErrorEnvelopeOptions = {
  description: string;
  examples: Record<
    string,
    {
      summary: string;
      value: ApiEnvelopeExample;
    }
  >;
};

/**
 * Builds the standard API envelope schema used by success and error responses.
 *
 * @param {Record<string, unknown>} dataSchema - OpenAPI schema for the data property.
 * @param {string} messageExample - Example value for the technical message.
 * @param {string} userMessageExample - Example value for the user-facing message.
 * @param {ApiEnvelopeExample} example - Optional complete response example.
 * @returns {Record<string, unknown>} The OpenAPI schema for the standard envelope.
 */
function buildEnvelopeSchema(
  dataSchema: Record<string, unknown>,
  messageExample: string,
  userMessageExample: string,
  example?: ApiEnvelopeExample,
): Record<string, unknown> {
  return {
    type: 'object',
    required: ['message', 'userMessage', 'data'],
    ...(example ? { example } : {}),
    properties: {
      message: {
        type: 'string',
        example: messageExample,
      },
      userMessage: {
        type: 'string',
        example: userMessageExample,
      },
      data: dataSchema,
    },
  };
}

/**
 * Builds OpenAPI content for error responses wrapped in the standard API envelope.
 *
 * @param {ApiErrorEnvelopeOptions['examples']} examples - Error examples indexed by example name.
 * @returns {Record<string, unknown>} OpenAPI content definition.
 */
function buildErrorEnvelopeContent(
  examples: ApiErrorEnvelopeOptions['examples'],
): ContentObject {
  return {
    'application/json': {
      schema: buildEnvelopeSchema(
        {
          nullable: true,
          oneOf: [
            { type: 'array' },
            { type: 'object' },
            { type: 'string' },
            { type: 'boolean' },
            { type: 'number' },
          ],
        },
        'validation error',
        'erro de validação',
      ),
      examples,
    },
  };
}

/**
 * Documents a created response wrapped in the standard API envelope.
 *
 * @param {ApiEnvelopeOptions} options - Response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiCreatedEnvelopeResponse(
  options: ApiEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(options.model),
    ApiCreatedResponse({
      description: options.description,
      schema: buildEnvelopeSchema(
        { $ref: getSchemaPath(options.model) },
        'success',
        options.userMessage ?? 'sucesso',
      ),
    }),
  );
}

/**
 * Documents an ok response wrapped in the standard API envelope.
 *
 * @param {ApiEnvelopeOptions} options - Response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiOkEnvelopeResponse(
  options: ApiEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(options.model),
    ApiOkResponse({
      description: options.description,
      schema: buildEnvelopeSchema(
        { $ref: getSchemaPath(options.model) },
        'success',
        options.userMessage ?? 'sucesso',
      ),
    }),
  );
}

/**
 * Documents an ok response with array data wrapped in the standard API envelope.
 *
 * @param {ApiEnvelopeOptions} options - Response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiOkArrayEnvelopeResponse(
  options: ApiEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(options.model),
    ApiOkResponse({
      description: options.description,
      schema: buildEnvelopeSchema(
        {
          type: 'array',
          items: { $ref: getSchemaPath(options.model) },
        },
        'success',
        options.userMessage ?? 'sucesso',
        {
          message: 'success',
          userMessage: options.userMessage ?? 'sucesso',
          data: options.dataExample ?? [],
        },
      ),
    }),
  );
}

/**
 * Documents a bad request response wrapped in the standard API envelope.
 *
 * @param {ApiErrorEnvelopeOptions} options - Error response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiBadRequestEnvelopeResponse(
  options: ApiErrorEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiBadRequestResponse({
      description: options.description,
      content: buildErrorEnvelopeContent(options.examples),
    }),
  );
}

/**
 * Documents an unauthorized response wrapped in the standard API envelope.
 *
 * @param {ApiErrorEnvelopeOptions} options - Error response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiUnauthorizedEnvelopeResponse(
  options: ApiErrorEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: options.description,
      content: buildErrorEnvelopeContent(options.examples),
    }),
  );
}

/**
 * Documents a forbidden response wrapped in the standard API envelope.
 *
 * @param {ApiErrorEnvelopeOptions} options - Error response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiForbiddenEnvelopeResponse(
  options: ApiErrorEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiForbiddenResponse({
      description: options.description,
      content: buildErrorEnvelopeContent(options.examples),
    }),
  );
}

/**
 * Documents a not found response wrapped in the standard API envelope.
 *
 * @param {ApiErrorEnvelopeOptions} options - Error response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiNotFoundEnvelopeResponse(
  options: ApiErrorEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiNotFoundResponse({
      description: options.description,
      content: buildErrorEnvelopeContent(options.examples),
    }),
  );
}

/**
 * Documents a conflict response wrapped in the standard API envelope.
 *
 * @param {ApiErrorEnvelopeOptions} options - Error response documentation options.
 * @returns {MethodDecorator & ClassDecorator} Swagger decorators.
 */
export function ApiConflictEnvelopeResponse(
  options: ApiErrorEnvelopeOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiConflictResponse({
      description: options.description,
      content: buildErrorEnvelopeContent(options.examples),
    }),
  );
}
