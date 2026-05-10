import { ApiProperty } from '@nestjs/swagger';
import { SurveyResponseAnswerResponse } from './SurveyResponseAnswer.response';

/**
 * Response responsible for formatting created survey response answers.
 */
export class CreateSurveyResponseAnswersResponse {
  @ApiProperty({ example: 1 })
  public readonly surveyResponseId: number;

  @ApiProperty({ type: () => [SurveyResponseAnswerResponse] })
  public readonly answers: SurveyResponseAnswerResponse[];

  /**
   * CreateSurveyResponseAnswersResponse constructor.
   *
   * @param {number} surveyResponseId - The survey response id.
   * @param {SurveyResponseAnswerResponse[]} answers - The created answer responses.
   */
  public constructor(
    surveyResponseId: number,
    answers: SurveyResponseAnswerResponse[],
  ) {
    this.surveyResponseId = surveyResponseId;
    this.answers = answers;
  }

  /**
   * Creates a CreateSurveyResponseAnswersResponse instance.
   *
   * @param {number} surveyResponseId - The survey response id.
   * @param {SurveyResponseAnswerResponse[]} answers - The created answer responses.
   * @returns {CreateSurveyResponseAnswersResponse} The formatted created answers response.
   */
  public static fromAnswers(
    surveyResponseId: number,
    answers: SurveyResponseAnswerResponse[],
  ): CreateSurveyResponseAnswersResponse {
    return new CreateSurveyResponseAnswersResponse(surveyResponseId, answers);
  }
}
