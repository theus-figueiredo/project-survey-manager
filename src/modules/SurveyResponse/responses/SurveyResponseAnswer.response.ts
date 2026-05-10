import { ApiProperty } from '@nestjs/swagger';
import { SurveyFieldTypesEnum } from '../../SurveyField/enums/SurveyFieldTypes.enum';
import { SurveyResponseAnswer } from '../entities/SurveyResponseAnswer.entity';

/**
 * Response responsible for formatting survey response answer data returned by the API.
 */
export class SurveyResponseAnswerResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({
    example: {
      id: 10,
      label: 'Nome completo',
      type: SurveyFieldTypesEnum.TEXT,
    },
  })
  public readonly field: {
    id: number;
    label: string;
    type: SurveyFieldTypesEnum;
  };

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
   * SurveyResponseAnswerResponse constructor.
   *
   * @param {SurveyResponseAnswer} answer - The survey response answer entity.
   */
  public constructor(answer: SurveyResponseAnswer) {
    this.id = answer.id;
    this.field = {
      id: answer.surveyField.id,
      label: answer.surveyField.label,
      type: answer.surveyField.type,
    };
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
   * Creates a SurveyResponseAnswerResponse from a SurveyResponseAnswer entity.
   *
   * @param {SurveyResponseAnswer} answer - The survey response answer entity.
   * @returns {SurveyResponseAnswerResponse} The formatted survey response answer.
   */
  public static fromSurveyResponseAnswer(
    answer: SurveyResponseAnswer,
  ): SurveyResponseAnswerResponse {
    return new SurveyResponseAnswerResponse(answer);
  }
}
