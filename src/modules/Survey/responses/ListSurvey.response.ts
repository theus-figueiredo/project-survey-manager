import { ApiProperty } from '@nestjs/swagger';
import { SurveyFieldOptionResponse } from '../../SurveyFieldOption/responses/SurveyFieldOption.response';
import { SurveyFieldResponse } from '../../SurveyField/responses/SurveyField.response';
import { Survey } from '../entities/Survey.entity';

/**
 * Response responsible for formatting survey data returned by list endpoints.
 */
export class ListSurveyResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({ example: 'Pesquisa de onboarding' })
  public readonly title: string;

  @ApiProperty({ example: false, nullable: true })
  public readonly ['default']: boolean | null;

  @ApiProperty({
    example: {
      id: 1,
      name: 'EYF Onboarding',
    },
    nullable: true,
  })
  public readonly project: {
    id: number;
    name: string;
  } | null;

  @ApiProperty({ type: () => [SurveyFieldResponse] })
  public readonly fields: SurveyFieldResponse[];

  @ApiProperty({ example: '2026-04-12T12:00:00.000Z' })
  public readonly createdAt: Date;

  @ApiProperty({ example: '2026-04-12T12:00:00.000Z' })
  public readonly updatedAt: Date;

  /**
   * ListSurveyResponse constructor.
   *
   * @param {number} id - The survey id.
   * @param {string} title - The survey title.
   * @param {boolean | null} defaultValue - Whether the survey is marked as default.
   * @param {{ id: number; name: string } | null} project - The project associated with the survey.
   * @param {SurveyFieldResponse[]} fields - The formatted survey fields.
   * @param {Date} createdAt - The survey creation date.
   * @param {Date} updatedAt - The survey last update date.
   */
  public constructor(
    id: number,
    title: string,
    defaultValue: boolean | null,
    project: {
      id: number;
      name: string;
    } | null,
    fields: SurveyFieldResponse[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.default = defaultValue;
    this.project = project;
    this.fields = fields;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Creates a ListSurveyResponse from a Survey entity.
   *
   * @param {Survey} survey - The survey entity.
   * @returns {ListSurveyResponse} The formatted list survey response.
   */
  public static fromSurvey(survey: Survey): ListSurveyResponse {
    const project = survey.projects?.[0] ?? null;
    const fields = (survey.fields ?? []).map((field) =>
      SurveyFieldResponse.fromSurveyField(
        field,
        (field.options ?? []).map((option) =>
          SurveyFieldOptionResponse.fromSurveyFieldOption(option),
        ),
      ),
    );

    return new ListSurveyResponse(
      survey.id,
      survey.title,
      survey.default,
      project
        ? {
            id: project.id,
            name: project.name,
          }
        : null,
      fields,
      survey.createdAt,
      survey.updatedAt,
    );
  }
}
