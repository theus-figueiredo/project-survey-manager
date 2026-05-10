import { ApiProperty } from '@nestjs/swagger';
import { SurveyFieldOption } from '../entities/SurveyFieldOption.entity';

/**
 * Response responsible for formatting survey field option data returned by the API.
 */
export class SurveyFieldOptionResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({ example: 'Google' })
  public readonly value: string;

  @ApiProperty({ example: 1 })
  public readonly order: number;

  /**
   * SurveyFieldOptionResponse constructor.
   *
   * @param {number} id - The survey field option id.
   * @param {string} value - The survey field option value.
   * @param {number} order - The survey field option display order.
   */
  public constructor(
    id: number,
    value: string,
    order: number,
  ) {
    this.id = id;
    this.value = value;
    this.order = order;
  }

  /**
   * Creates a SurveyFieldOptionResponse from a SurveyFieldOption entity.
   *
   * @param {SurveyFieldOption} option - The survey field option entity.
   * @returns {SurveyFieldOptionResponse} The formatted survey field option response.
   */
  public static fromSurveyFieldOption(
    option: SurveyFieldOption,
  ): SurveyFieldOptionResponse {
    return new SurveyFieldOptionResponse(option.id, option.value, option.order);
  }
}
