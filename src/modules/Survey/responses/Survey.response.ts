import { ApiProperty } from '@nestjs/swagger';
import { SurveyResponseAnswer } from '../../SurveyResponse/entities/SurveyResponseAnswer.entity';
import { SurveyFieldAnswerResponse } from '../../SurveyField/responses/SurveyFieldAnswer.response';
import { SurveyFieldOptionResponse } from '../../SurveyFieldOption/responses/SurveyFieldOption.response';
import { SurveyFieldResponse } from '../../SurveyField/responses/SurveyField.response';
import { Survey } from '../entities/Survey.entity';

/**
 * Response responsible for formatting survey data returned by the API.
 */
export class SurveyResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({ example: 'Pesquisa de onboarding' })
  public readonly title: string;

  @ApiProperty({ example: false, nullable: true })
  public readonly ['default']: boolean | null;

  @ApiProperty({
    example: {
      id: 1,
      email: 'admin.consultant@test.com',
      name: 'Admin Consultant',
    },
  })
  public readonly createdBy: {
    id: number;
    email: string;
    name: string;
  };

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
   * SurveyResponse constructor.
   *
   * @param {number} id - The survey id.
   * @param {string} title - The survey title.
   * @param {boolean | null} defaultValue - Whether the survey is marked as default.
   * @param {{ id: number; email: string; name: string }} createdBy - The user that created the survey.
   * @param {{ id: number; name: string } | null} project - The project associated with the survey.
   * @param {SurveyFieldResponse[]} fields - The formatted survey fields.
   * @param {Date} createdAt - The survey creation date.
   * @param {Date} updatedAt - The survey last update date.
   */
  public constructor(
    id: number,
    title: string,
    defaultValue: boolean | null,
    createdBy: {
      id: number;
      email: string;
      name: string;
    },
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
    this.createdBy = createdBy;
    this.project = project;
    this.fields = fields;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Creates a SurveyResponse from a Survey entity.
   *
   * @param {Survey} survey - The survey entity.
   * @param {SurveyFieldResponse[]} fields - The formatted survey fields.
   * @returns {SurveyResponse} The formatted survey response.
   */
  public static fromSurvey(
    survey: Survey,
    fields: SurveyFieldResponse[],
  ): SurveyResponse {
    const project = survey.projects?.[0] ?? null;

    return new SurveyResponse(
      survey.id,
      survey.title,
      survey.default,
      {
        id: survey.createdBy.id,
        email: survey.createdBy.email,
        name: survey.createdBy.name,
      },
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

  /**
   * Creates a SurveyResponse from a Survey entity with loaded relations.
   *
   * @param {Survey} survey - The survey entity with createdBy, projects, fields, and options loaded.
   * @returns {SurveyResponse} The formatted survey response.
   */
  public static fromSurveyWithRelations(survey: Survey): SurveyResponse {
    const fields = (survey.fields ?? []).map((field) =>
      SurveyFieldResponse.fromSurveyField(
        field,
        (field.options ?? []).map((option) =>
          SurveyFieldOptionResponse.fromSurveyFieldOption(option),
        ),
      ),
    );

    return SurveyResponse.fromSurvey(survey, fields);
  }

  /**
   * Creates a SurveyResponse from a Survey entity with loaded relations and answers.
   *
   * @param {Survey} survey - The survey entity with createdBy, projects, fields, and options loaded.
   * @param {SurveyResponseAnswer[]} answers - Survey response answers loaded from a specific survey response.
   * @returns {SurveyResponse} The formatted survey response.
   */
  public static fromSurveyWithRelationsAndAnswers(
    survey: Survey,
    answers: SurveyResponseAnswer[],
  ): SurveyResponse {
    const answersByFieldId = answers.reduce(
      (
        mappedAnswers: Map<number, SurveyFieldAnswerResponse[]>,
        answer: SurveyResponseAnswer,
      ): Map<number, SurveyFieldAnswerResponse[]> => {
        const fieldAnswers =
          mappedAnswers.get(answer.surveyField.id) ?? [];
        fieldAnswers.push(
          SurveyFieldAnswerResponse.fromSurveyResponseAnswer(answer),
        );
        mappedAnswers.set(answer.surveyField.id, fieldAnswers);

        return mappedAnswers;
      },
      new Map<number, SurveyFieldAnswerResponse[]>(),
    );

    const fields = (survey.fields ?? []).map((field) => {
      const fieldAnswers = answersByFieldId.get(field.id) ?? null;

      return SurveyFieldResponse.fromSurveyField(
        field,
        (field.options ?? []).map((option) =>
          SurveyFieldOptionResponse.fromSurveyFieldOption(option),
        ),
        fieldAnswers,
      );
    });

    return SurveyResponse.fromSurvey(survey, fields);
  }
}
