import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateSurveyResponseAnswersBulkDto } from '../dto/CreateSurveyResponseAnswersBulk.dto';
import { CreateSurveyResponseAnswersResponse } from '../responses/CreateSurveyResponseAnswers.response';
import { CreateSurveyResponseAnswerService } from './CreateSurveyResponseAnswer.service';

/**
 * Service responsible for creating survey response answers in bulk.
 */
@Injectable()
export class CreateSurveyResponseAnswersBulkService {
  /**
   * CreateSurveyResponseAnswersBulkService constructor.
   *
   * @param {DataSource} dataSource - Data source used to run bulk creation transactions.
   * @param {CreateSurveyResponseAnswerService} createSurveyResponseAnswerService - Service used to create answer entities.
   */
  public constructor(
    protected readonly dataSource: DataSource,
    protected readonly createSurveyResponseAnswerService: CreateSurveyResponseAnswerService,
  ) {}

  /**
   * Creates survey response answers in a single transaction.
   *
   * @param {CreateSurveyResponseAnswersBulkDto} createSurveyResponseAnswersBulkDto - DTO containing bulk answer creation data.
   * @returns {Promise<CreateSurveyResponseAnswersResponse>} A promise that resolves to the created answers.
   */
  public async create(
    createSurveyResponseAnswersBulkDto: CreateSurveyResponseAnswersBulkDto,
  ): Promise<CreateSurveyResponseAnswersResponse> {
    return this.dataSource.transaction(
      async (manager: EntityManager): Promise<CreateSurveyResponseAnswersResponse> => {
        const answers =
          await this.createSurveyResponseAnswerService.createManyWithManager(
            createSurveyResponseAnswersBulkDto.surveyResponseId,
            createSurveyResponseAnswersBulkDto.answers,
            manager,
          );

        return CreateSurveyResponseAnswersResponse.fromAnswers(
          createSurveyResponseAnswersBulkDto.surveyResponseId,
          answers,
        );
      },
    );
  }
}
