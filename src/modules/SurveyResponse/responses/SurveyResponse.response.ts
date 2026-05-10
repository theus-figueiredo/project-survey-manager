import { ApiProperty } from '@nestjs/swagger';
import { SurveyResponse } from '../entities/SurveyResponse.entity';

/**
 * Response responsible for formatting survey response data returned by the API.
 */
export class SurveyResponseResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({
    example: {
      id: 1,
      title: 'Pesquisa de onboarding',
    },
  })
  public readonly survey: {
    id: number;
    title: string;
  };

  @ApiProperty({
    example: {
      email: 'user.consultant@test.com',
      name: 'User Consultant',
    },
    nullable: true,
  })
  public readonly user: {
    email: string;
    name: string;
  } | null;

  @ApiProperty({ example: null, nullable: true })
  public readonly submittedAt: Date | null;

  @ApiProperty({ example: '2026-04-19T12:00:00.000Z' })
  public readonly createdAt: Date;

  @ApiProperty({ example: '2026-04-19T12:00:00.000Z' })
  public readonly updatedAt: Date;

  /**
   * SurveyResponseResponse constructor.
   *
   * @param {SurveyResponse} surveyResponse - The survey response entity.
   */
  public constructor(surveyResponse: SurveyResponse) {
    this.id = surveyResponse.id;
    this.survey = {
      id: surveyResponse.survey.id,
      title: surveyResponse.survey.title,
    };
    this.user = surveyResponse.user
      ? {
          email: surveyResponse.user.email,
          name: surveyResponse.user.name,
        }
      : null;
    this.submittedAt = surveyResponse.submittedAt;
    this.createdAt = surveyResponse.createdAt;
    this.updatedAt = surveyResponse.updatedAt;
  }

  /**
   * Creates a SurveyResponseResponse from a SurveyResponse entity.
   *
   * @param {SurveyResponse} surveyResponse - The survey response entity.
   * @returns {SurveyResponseResponse} The formatted survey response response.
   */
  public static fromSurveyResponse(
    surveyResponse: SurveyResponse,
  ): SurveyResponseResponse {
    return new SurveyResponseResponse(surveyResponse);
  }
}
