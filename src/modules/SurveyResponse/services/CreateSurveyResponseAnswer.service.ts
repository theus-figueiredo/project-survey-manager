import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ClientException } from '../../../common/errors/Client.exception';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { SurveyFieldOption } from '../../SurveyFieldOption/entities/SurveyFieldOption.entity';
import { SurveyField } from '../../SurveyField/entities/SurveyField.entity';
import { SurveyFieldTypesEnum } from '../../SurveyField/enums/SurveyFieldTypes.enum';
import { CreateSurveyResponseAnswerDto } from '../dto/CreateSurveyResponseAnswer.dto';
import { CreateSurveyResponseAnswerItemDto } from '../dto/CreateSurveyResponseAnswerItem.dto';
import { SurveyResponseAnswer } from '../entities/SurveyResponseAnswer.entity';
import { SurveyResponse } from '../entities/SurveyResponse.entity';
import { CreateSurveyResponseAnswersResponse } from '../responses/CreateSurveyResponseAnswers.response';
import { SurveyResponseAnswerResponse } from '../responses/SurveyResponseAnswer.response';

/**
 * Service responsible for creating survey response answers.
 */
@Injectable()
export class CreateSurveyResponseAnswerService {
  protected readonly freeValueFieldTypes: SurveyFieldTypesEnum[] = [
    SurveyFieldTypesEnum.TEXT,
    SurveyFieldTypesEnum.EMAIL,
    SurveyFieldTypesEnum.PHONE_NUMBER,
    SurveyFieldTypesEnum.DATE,
    SurveyFieldTypesEnum.TEXT_AREA,
  ];

  protected readonly singleOptionFieldTypes: SurveyFieldTypesEnum[] = [
    SurveyFieldTypesEnum.SELECT,
    SurveyFieldTypesEnum.RADIO,
  ];

  /**
   * CreateSurveyResponseAnswerService constructor.
   *
   * @param {DataSource} dataSource - Data source used to run answer creation transactions.
   */
  public constructor(protected readonly dataSource: DataSource) {}

  /**
   * Creates answers for a single field answer payload.
   *
   * @param {CreateSurveyResponseAnswerDto} createSurveyResponseAnswerDto - DTO containing answer creation data.
   * @returns {Promise<CreateSurveyResponseAnswersResponse>} A promise that resolves to the created answers.
   */
  public async create(
    createSurveyResponseAnswerDto: CreateSurveyResponseAnswerDto,
  ): Promise<CreateSurveyResponseAnswersResponse> {
    return this.dataSource.transaction(
      async (manager: EntityManager): Promise<CreateSurveyResponseAnswersResponse> => {
        const answers = await this.createManyWithManager(
          createSurveyResponseAnswerDto.surveyResponseId,
          [createSurveyResponseAnswerDto],
          manager,
        );

        return CreateSurveyResponseAnswersResponse.fromAnswers(
          createSurveyResponseAnswerDto.surveyResponseId,
          answers,
        );
      },
    );
  }

  /**
   * Creates multiple answer entities using an existing transaction manager.
   *
   * @param {number} surveyResponseId - Survey response id that owns the answers.
   * @param {CreateSurveyResponseAnswerItemDto[]} answerItems - Answer items to create.
   * @param {EntityManager} manager - Transaction manager used to persist answers.
   * @returns {Promise<SurveyResponseAnswerResponse[]>} A promise that resolves to the created answer responses.
   */
  public async createManyWithManager(
    surveyResponseId: number,
    answerItems: CreateSurveyResponseAnswerItemDto[],
    manager: EntityManager,
  ): Promise<SurveyResponseAnswerResponse[]> {
    this.validateDuplicatedFieldsInPayload(answerItems);

    const surveyResponse = await this.getSurveyResponse(
      surveyResponseId,
      manager,
    );
    const fieldsById = new Map<number, SurveyField>(
      surveyResponse.survey.fields.map((field: SurveyField) => [
        field.id,
        field,
      ]),
    );

    await this.validateExistingAnswers(
      surveyResponseId,
      answerItems.map((answerItem: CreateSurveyResponseAnswerItemDto) => answerItem.fieldId),
      manager,
    );

    const answers = answerItems.flatMap(
      (answerItem: CreateSurveyResponseAnswerItemDto): SurveyResponseAnswer[] => {
        const field = fieldsById.get(answerItem.fieldId);

        if (!field) {
          throw new ClientException(
            'Survey field does not belong to survey response survey',
            'Campo não pertence à survey respondida',
            {
              surveyResponseId,
              fieldId: answerItem.fieldId,
            },
          );
        }

        return this.buildAnswerEntities(surveyResponse, field, answerItem);
      },
    );

    const savedAnswers = await manager
      .getRepository(SurveyResponseAnswer)
      .save(answers);

    return savedAnswers.map((answer: SurveyResponseAnswer) =>
      SurveyResponseAnswerResponse.fromSurveyResponseAnswer(answer),
    );
  }

  /**
   * Retrieves the survey response with survey fields and options.
   *
   * @param {number} surveyResponseId - Survey response id.
   * @param {EntityManager} manager - Transaction manager used to query data.
   * @returns {Promise<SurveyResponse>} A promise that resolves to the survey response entity.
   */
  protected async getSurveyResponse(
    surveyResponseId: number,
    manager: EntityManager,
  ): Promise<SurveyResponse> {
    const surveyResponse = await manager.getRepository(SurveyResponse).findOne({
      where: {
        id: surveyResponseId,
      },
      relations: {
        survey: {
          fields: {
            options: true,
          },
        },
      },
    });

    if (!surveyResponse) {
      throw new NotFoundException(
        'Survey response not found',
        'Resposta de survey não encontrada',
        { surveyResponseId },
      );
    }

    return surveyResponse;
  }

  /**
   * Validates duplicated fields inside the same request payload.
   *
   * @param {CreateSurveyResponseAnswerItemDto[]} answerItems - Answer items to validate.
   * @returns {void}
   */
  protected validateDuplicatedFieldsInPayload(
    answerItems: CreateSurveyResponseAnswerItemDto[],
  ): void {
    const uniqueFieldIds = new Set<number>();
    const duplicatedField = answerItems.find(
      (answerItem: CreateSurveyResponseAnswerItemDto): boolean => {
        if (uniqueFieldIds.has(answerItem.fieldId)) {
          return true;
        }

        uniqueFieldIds.add(answerItem.fieldId);

        return false;
      },
    );

    if (!duplicatedField) {
      return;
    }

    throw new ClientException(
      'Duplicated survey field answer in payload',
      'Campo respondido mais de uma vez na requisição',
      { fieldId: duplicatedField.fieldId },
    );
  }

  /**
   * Validates if any requested field was already answered for the survey response.
   *
   * @param {number} surveyResponseId - Survey response id.
   * @param {number[]} fieldIds - Survey field ids to validate.
   * @param {EntityManager} manager - Transaction manager used to query data.
   * @returns {Promise<void>} A promise that resolves when no duplicated persisted answer exists.
   */
  protected async validateExistingAnswers(
    surveyResponseId: number,
    fieldIds: number[],
    manager: EntityManager,
  ): Promise<void> {
    const existingAnswer = await manager
      .getRepository(SurveyResponseAnswer)
      .createQueryBuilder('answer')
      .innerJoin('answer.surveyResponse', 'surveyResponse')
      .innerJoin('answer.surveyField', 'surveyField')
      .where('surveyResponse.id = :surveyResponseId', { surveyResponseId })
      .andWhere('surveyField.id IN (:...fieldIds)', { fieldIds })
      .select('surveyField.id', 'fieldId')
      .getRawOne<{ fieldId: number }>();

    if (!existingAnswer) {
      return;
    }

    throw new ClientException(
      'Survey response answer already exists',
      'Campo já respondido para esta resposta de survey',
      {
        surveyResponseId,
        fieldId: Number(existingAnswer.fieldId),
      },
    );
  }

  /**
   * Builds answer entities according to the survey field type.
   *
   * @param {SurveyResponse} surveyResponse - Survey response that owns the answers.
   * @param {SurveyField} field - Survey field being answered.
   * @param {CreateSurveyResponseAnswerItemDto} answerItem - Answer item payload.
   * @returns {SurveyResponseAnswer[]} The answer entities to persist.
   */
  protected buildAnswerEntities(
    surveyResponse: SurveyResponse,
    field: SurveyField,
    answerItem: CreateSurveyResponseAnswerItemDto,
  ): SurveyResponseAnswer[] {
    switch (true) {
      case this.freeValueFieldTypes.includes(field.type):
        return [this.buildFreeValueAnswer(surveyResponse, field, answerItem)];
      case this.singleOptionFieldTypes.includes(field.type):
        return [this.buildSingleOptionAnswer(surveyResponse, field, answerItem)];
      case field.type === SurveyFieldTypesEnum.CHECKBOX:
        return this.buildCheckboxAnswers(surveyResponse, field, answerItem);
      default:
        throw new ClientException(
          'Unsupported survey field type',
          'Tipo de campo de survey não suportado',
          {
            fieldId: field.id,
            type: field.type,
          },
        );
    }
  }

  /**
   * Builds a free value answer entity.
   *
   * @param {SurveyResponse} surveyResponse - Survey response that owns the answer.
   * @param {SurveyField} field - Survey field being answered.
   * @param {CreateSurveyResponseAnswerItemDto} answerItem - Answer item payload.
   * @returns {SurveyResponseAnswer} The answer entity.
   */
  protected buildFreeValueAnswer(
    surveyResponse: SurveyResponse,
    field: SurveyField,
    answerItem: CreateSurveyResponseAnswerItemDto,
  ): SurveyResponseAnswer {
    if (!answerItem.value || answerItem.optionId || answerItem.optionIds) {
      throw new ClientException(
        'Invalid answer payload for field type',
        'Resposta inválida para o tipo do campo',
        {
          fieldId: field.id,
          type: field.type,
        },
      );
    }

    return this.createAnswerEntity(surveyResponse, field, answerItem.value, null);
  }

  /**
   * Builds a single option answer entity.
   *
   * @param {SurveyResponse} surveyResponse - Survey response that owns the answer.
   * @param {SurveyField} field - Survey field being answered.
   * @param {CreateSurveyResponseAnswerItemDto} answerItem - Answer item payload.
   * @returns {SurveyResponseAnswer} The answer entity.
   */
  protected buildSingleOptionAnswer(
    surveyResponse: SurveyResponse,
    field: SurveyField,
    answerItem: CreateSurveyResponseAnswerItemDto,
  ): SurveyResponseAnswer {
    if (!answerItem.optionId || answerItem.value || answerItem.optionIds) {
      throw new ClientException(
        'Invalid answer payload for field type',
        'Resposta inválida para o tipo do campo',
        {
          fieldId: field.id,
          type: field.type,
        },
      );
    }

    const option = this.getFieldOption(field, answerItem.optionId);

    return this.createAnswerEntity(surveyResponse, field, null, option);
  }

  /**
   * Builds checkbox answer entities.
   *
   * @param {SurveyResponse} surveyResponse - Survey response that owns the answers.
   * @param {SurveyField} field - Survey field being answered.
   * @param {CreateSurveyResponseAnswerItemDto} answerItem - Answer item payload.
   * @returns {SurveyResponseAnswer[]} The answer entities.
   */
  protected buildCheckboxAnswers(
    surveyResponse: SurveyResponse,
    field: SurveyField,
    answerItem: CreateSurveyResponseAnswerItemDto,
  ): SurveyResponseAnswer[] {
    if (
      answerItem.value ||
      answerItem.optionId ||
      !answerItem.optionIds ||
      answerItem.optionIds.length === 0
    ) {
      throw new ClientException(
        'Invalid answer payload for field type',
        'Resposta inválida para o tipo do campo',
        {
          fieldId: field.id,
          type: field.type,
        },
      );
    }

    const uniqueOptionIds = new Set<number>(answerItem.optionIds);

    if (uniqueOptionIds.size !== answerItem.optionIds.length) {
      throw new ClientException(
        'Duplicated survey field option in payload',
        'Opção do campo enviada mais de uma vez',
        { fieldId: field.id },
      );
    }

    return answerItem.optionIds.map((optionId: number): SurveyResponseAnswer => {
      const option = this.getFieldOption(field, optionId);

      return this.createAnswerEntity(surveyResponse, field, null, option);
    });
  }

  /**
   * Retrieves an option from a field, ensuring it belongs to the field.
   *
   * @param {SurveyField} field - Survey field that owns the option.
   * @param {number} optionId - Option id to retrieve.
   * @returns {SurveyFieldOption} The field option entity.
   */
  protected getFieldOption(
    field: SurveyField,
    optionId: number,
  ): SurveyFieldOption {
    const option = field.options.find(
      (fieldOption: SurveyFieldOption): boolean => fieldOption.id === optionId,
    );

    if (!option) {
      throw new ClientException(
        'Survey field option does not belong to survey field',
        'Opção não pertence ao campo informado',
        {
          fieldId: field.id,
          optionId,
        },
      );
    }

    return option;
  }

  /**
   * Creates a SurveyResponseAnswer entity instance.
   *
   * @param {SurveyResponse} surveyResponse - Survey response that owns the answer.
   * @param {SurveyField} field - Survey field being answered.
   * @param {string | null} value - Free text answer value.
   * @param {SurveyFieldOption | null} option - Selected option answer.
   * @returns {SurveyResponseAnswer} The answer entity.
   */
  protected createAnswerEntity(
    surveyResponse: SurveyResponse,
    field: SurveyField,
    value: string | null,
    option: SurveyFieldOption | null,
  ): SurveyResponseAnswer {
    const answer = new SurveyResponseAnswer();
    answer.surveyResponse = surveyResponse;
    answer.surveyField = field;
    answer.surveyOption = option;
    answer.value = value;

    return answer;
  }
}
