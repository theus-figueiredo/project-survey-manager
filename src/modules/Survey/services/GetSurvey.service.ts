import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { SurveyResponse as SurveyResponseEntity } from '../../SurveyResponse/entities/SurveyResponse.entity';
import { GetSurvetDto } from '../dto/GetSurvet.dto';
import { Survey } from '../entities/Survey.entity';
import { SurveyResponse } from '../responses/Survey.response';

/**
 * Service responsible for retrieving surveys.
 *
 * This service will be used to retrieve a survey by id with its related data.
 */
@Injectable()
export class GetSurveyService {
  /**
   * GetSurveyService constructor.
   *
   * @param {Repository<Survey>} surveyRepository - Repository used to query surveys.
   * @param {Repository<SurveyResponseEntity>} surveyResponseRepository - Repository used to query survey responses.
   */
  public constructor(
    @InjectRepository(Survey)
    protected readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponseEntity)
    protected readonly surveyResponseRepository: Repository<SurveyResponseEntity>,
  ) {}

  /**
   * Retrieves a survey by id with its related data.
   *
   * @param {GetSurvetDto} getSurveyDto - DTO containing survey lookup data.
   * @returns {Promise<SurveyResponse>} A promise that resolves to the formatted survey response.
   * @throws {NotFoundException} Throws when the survey cannot be found.
   */
  public async get(getSurveyDto: GetSurvetDto): Promise<SurveyResponse> {
    try {
      const survey = await this.surveyRepository.findOneOrFail({
        where: { id: getSurveyDto.id },
        relations: {
          createdBy: true,
          projects: true,
          fields: {
            options: true,
          },
        },
        order: {
          fields: {
            order: 'ASC',
            options: {
              order: 'ASC',
            },
          },
        },
      });

      if (getSurveyDto.withResponse === true) {
        const surveyResponse = await this.getSurveyResponseWithAnswers(
          getSurveyDto.id,
        );

        return SurveyResponse.fromSurveyWithRelationsAndAnswers(
          survey,
          surveyResponse.answers ?? [],
        );
      }

      return SurveyResponse.fromSurveyWithRelations(survey);
    } catch (error) {
      if (!(error instanceof EntityNotFoundError)) {
        throw error;
      }

      throw new NotFoundException('Survey not found', 'Survey não encontrada', {
        id: getSurveyDto.id,
      });
    }
  }

  /**
   * Retrieves a survey response with its answers, ensuring it belongs to the requested survey.
   *
   * @param {number} surveyId - Survey id that should own the survey response.
   * @returns {Promise<SurveyResponseEntity>} A promise that resolves to the survey response entity.
   */
  protected async getSurveyResponseWithAnswers(
    surveyId: number,
  ): Promise<SurveyResponseEntity> {
    const surveyResponse = await this.surveyResponseRepository.findOne({
      where: {
        survey: {
          id: surveyId,
        },
      },
      relations: {
        survey: true,
        answers: {
          surveyField: true,
          surveyOption: true,
        },
      },
    });

    if (!surveyResponse) {
      throw new NotFoundException(
        'Survey response not found',
        'Resposta de survey não encontrada',
        { surveyId },
      );
    }

    return surveyResponse;
  }
}
