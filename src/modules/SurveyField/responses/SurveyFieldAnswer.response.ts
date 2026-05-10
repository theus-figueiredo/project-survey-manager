import { ApiProperty } from '@nestjs/swagger';
import { SurveyResponseAnswer } from '../../SurveyResponse/entities/SurveyResponseAnswer.entity';

/**
 * Response responsible for formatting survey field answer data returned inside survey fields.
 */
export class SurveyFieldAnswerResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({ example: 'João da Silva', nullable: true })
  public readonly value: string | null;

  @ApiProperty({
    example: {
      id: 5,
      value: 'Google',
    },
    nullable: true,
  })
  public readonly option: {
    id: number;
    value: string;
  } | null;

  @ApiProperty({ example: '2026-04-19T12:00:00.000Z' })
  public readonly createdAt: Date;

  @ApiProperty({ example: '2026-04-19T12:00:00.000Z' })
  public readonly updatedAt: Date;

  /**
   * SurveyFieldAnswerResponse constructor.
   *
   * @param {SurveyResponseAnswer} answer - The survey response answer entity.
   */
  public constructor(answer: SurveyResponseAnswer) {
    this.id = answer.id;
    this.value = answer.value;
    this.option = answer.surveyOption
      ? {
          id: answer.surveyOption.id,
          value: answer.surveyOption.value,
        }
      : null;
    this.createdAt = answer.createdAt;
    this.updatedAt = answer.updatedAt;
  }

  /**
   * Creates a SurveyFieldAnswerResponse from a SurveyResponseAnswer entity.
   *
   * @param {SurveyResponseAnswer} answer - The survey response answer entity.
   * @returns {SurveyFieldAnswerResponse} The formatted survey field answer.
   */
  public static fromSurveyResponseAnswer(
    answer: SurveyResponseAnswer,
  ): SurveyFieldAnswerResponse {
    return new SurveyFieldAnswerResponse(answer);
  }
}
