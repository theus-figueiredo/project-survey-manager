import { ApiProperty } from '@nestjs/swagger';
import { SurveyField } from '../entities/SurveyField.entity';
import { SurveyFieldTypesEnum } from '../enums/SurveyFieldTypes.enum';
import { SurveyFieldAnswerResponse } from './SurveyFieldAnswer.response';
import { SurveyFieldOptionResponse } from '../../SurveyFieldOption/responses/SurveyFieldOption.response';

/**
 * Response responsible for formatting survey field data returned by the API.
 */
export class SurveyFieldResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({
    enum: SurveyFieldTypesEnum,
    example: SurveyFieldTypesEnum.SELECT,
  })
  public readonly type: SurveyFieldTypesEnum;

  @ApiProperty({ example: 'Como voce conheceu a empresa?' })
  public readonly label: string;

  @ApiProperty({ example: null, nullable: true })
  public readonly placeholder: string | null;

  @ApiProperty({ example: true })
  public readonly required: boolean;

  @ApiProperty({ example: 1 })
  public readonly order: number;

  @ApiProperty({ type: () => [SurveyFieldOptionResponse], nullable: true })
  public readonly options: SurveyFieldOptionResponse[] | null;

  @ApiProperty({
    type: () => [SurveyFieldAnswerResponse],
    nullable: true,
    required: false,
  })
  public readonly answer?: SurveyFieldAnswerResponse[] | null;

  /**
   * SurveyFieldResponse constructor.
   *
   * @param {number} id - The survey field id.
   * @param {SurveyFieldTypesEnum} type - The survey field type.
   * @param {string} label - The survey field label.
   * @param {string | null} placeholder - The survey field placeholder.
   * @param {boolean} required - Whether the field is required.
   * @param {number} order - The survey field display order.
   * @param {SurveyFieldOptionResponse[] | null} options - The survey field option responses.
   * @param {SurveyFieldAnswerResponse[] | null} answer - The survey field answer responses.
   */
  public constructor(
    id: number,
    type: SurveyFieldTypesEnum,
    label: string,
    placeholder: string | null,
    required: boolean,
    order: number,
    options: SurveyFieldOptionResponse[] | null,
    answer?: SurveyFieldAnswerResponse[] | null,
  ) {
    this.id = id;
    this.type = type;
    this.label = label;
    this.placeholder = placeholder;
    this.required = required;
    this.order = order;
    this.options = options;
    if (answer !== undefined) {
      this.answer = answer;
    }
  }

  /**
   * Creates a SurveyFieldResponse from a SurveyField entity.
   *
   * @param {SurveyField} field - The survey field entity.
   * @param {SurveyFieldOptionResponse[] | null} options - The formatted survey field options.
   * @param {SurveyFieldAnswerResponse[] | null} answer - The formatted survey field answers.
   * @returns {SurveyFieldResponse} The formatted survey field response.
   */
  public static fromSurveyField(
    field: SurveyField,
    options: SurveyFieldOptionResponse[] | null = null,
    answer?: SurveyFieldAnswerResponse[] | null,
  ): SurveyFieldResponse {
    const normalizedOptions = options && options.length > 0 ? options : null;

    return new SurveyFieldResponse(
      field.id,
      field.type,
      field.label,
      field.placeholder,
      field.required,
      field.order,
      normalizedOptions,
      answer,
    );
  }
}
