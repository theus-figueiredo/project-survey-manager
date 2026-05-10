import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ListSurveyDto } from '../dto/ListSurvey.dto';
import { Survey } from '../entities/Survey.entity';
import { ListSurveyResponse } from '../responses/ListSurvey.response';

/**
 * Service responsible for listing surveys.
 */
@Injectable()
export class ListSurveyService {
  /**
   * ListSurveyService constructor.
   *
   * @param {Repository<Survey>} surveyRepository - Repository used to query surveys.
   */
  public constructor(
    @InjectRepository(Survey)
    protected readonly surveyRepository: Repository<Survey>,
  ) {}

  /**
   * Lists surveys filtered by default flag or project id.
   *
   * @param {ListSurveyDto} dto - Validated filters.
   * @returns {Promise<ListSurveyResponse[]>} A promise that resolves to the formatted survey list.
   */
  public async list(dto: ListSurveyDto): Promise<ListSurveyResponse[]> {
    const where: FindOptionsWhere<Survey> =
      dto.default === true
        ? { default: true }
        : { projects: { id: dto.projectId } };

    const surveys = await this.surveyRepository.find({
      where,
      relations: {
        projects: true,
        fields: {
          options: true,
        },
      },
    });

    return surveys.map((survey) => ListSurveyResponse.fromSurvey(survey));
  }
}
