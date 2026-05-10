import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from '../../Auth/types/UserData.type';
import { Survey } from '../../Survey/entities/Survey.entity';
import { GetSurveyService } from '../../Survey/services/GetSurvey.service';
import { GetUserService } from '../../User/services/GetUser.service';
import { CreateSurveyResponseDto } from '../dto/CreateSurveyResponse.dto';
import { SurveyResponse } from '../entities/SurveyResponse.entity';
import { SurveyResponseResponse } from '../responses/SurveyResponse.response';

/**
 * Service responsible for creating survey responses.
 */
@Injectable()
export class CreateSurveyResponseService {
  /**
   * CreateSurveyResponseService constructor.
   *
   * @param {Repository<SurveyResponse>} surveyResponseRepository - Repository used to persist survey responses.
   * @param {GetSurveyService} getSurveyService - Service used to validate survey existence.
   * @param {GetUserService} getUserService - Service used to retrieve the authenticated user entity.
   */
  public constructor(
    @InjectRepository(SurveyResponse)
    protected readonly surveyResponseRepository: Repository<SurveyResponse>,
    protected readonly getSurveyService: GetSurveyService,
    protected readonly getUserService: GetUserService,
  ) {}

  /**
   * Creates a survey response without creating its answers.
   *
   * @param {CreateSurveyResponseDto} createSurveyResponseDto - DTO containing survey response creation data.
   * @param {UserData} authenticatedUser - The authenticated user creating the survey response.
   * @returns {Promise<SurveyResponseResponse>} A promise that resolves to the created survey response.
   */
  public async create(createSurveyResponseDto: CreateSurveyResponseDto, authenticatedUser: UserData,): Promise<SurveyResponseResponse> {
    const survey = await this.getSurveyService.get({
      id: createSurveyResponseDto.surveyId,
    });
    const user = await this.getUserService.getById(authenticatedUser.id);
    const surveyResponse = this.surveyResponseRepository.create({
      survey: { id: survey.id } as Survey,
      user,
      submittedAt: null,
    });

    const savedSurveyResponse =
      await this.surveyResponseRepository.save(surveyResponse);
    savedSurveyResponse.survey = {
      id: survey.id,
      title: survey.title,
    } as Survey;
    savedSurveyResponse.user = user;

    return SurveyResponseResponse.fromSurveyResponse(savedSurveyResponse);
  }
}
