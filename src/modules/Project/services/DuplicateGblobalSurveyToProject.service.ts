import { Injectable } from '@nestjs/common';
import { UserData } from '../../Auth/types/UserData.type';
import { CreateSurveyDto } from '../../Survey/dto/CreateSurvey.dto';
import { ListSurveyDto } from '../../Survey/dto/ListSurvey.dto';
import { ListSurveyResponse } from '../../Survey/responses/ListSurvey.response';
import { SurveyResponse } from '../../Survey/responses/Survey.response';
import { CreateSurveyService } from '../../Survey/services/CreateSurvey.service';
import { ListSurveyService } from '../../Survey/services/ListSurvey.service';
import { CreateSurveyFieldDto } from '../../SurveyField/dto/CreateSurveyField.dto';
import { CreateSurveyFieldOptionDto } from '../../SurveyFieldOption/dto/CreateSurveyFieldOption.dto';

/**
 * Service responsible for duplicating default surveys into a project.
 */
@Injectable()
export class DuplicateGlobalSurveyToProjectService {
  /**
   * DuplicateGlobalSurveyToProjectService constructor.
   *
   * @param {CreateSurveyService} createSurveyService - Service used to create the new surveys.
   * @param {ListSurveyService} listSurveyService - Service used to list default surveys.
   */
  public constructor(
    protected readonly createSurveyService: CreateSurveyService,
    protected readonly listSurveyService: ListSurveyService,
  ) {}

  /**
   * Duplicates all default surveys and associates the new records with a project and creator.
   *
   * @param {number} projectId - The project id that will be associated with the duplicated surveys.
   * @param {number} userId - The user id that will be used as createdBy for the duplicated surveys.
   * @returns {Promise<SurveyResponse[]>} A promise that resolves to the created survey responses.
   */
  public async duplicateToProject(projectId: number,userId: number): Promise<SurveyResponse[]> {
    const listSurveyDto = new ListSurveyDto();
    listSurveyDto.default = true;

    const defaultSurveys = await this.listSurveyService.list(listSurveyDto);

    return this.createSurveysFromDefaultSurveys(
      defaultSurveys,
      projectId,
      userId,
    );
  }

  /**
   * Iterates over default surveys and creates their project-specific copies.
   *
   * @param {ListSurveyResponse[]} defaultSurveys - The default surveys to duplicate.
   * @param {number} projectId - The project id for the new surveys.
   * @param {number} userId - The creator user id for the new surveys.
   * @returns {Promise<SurveyResponse[]>} A promise that resolves to the created survey responses.
   */
  protected async createSurveysFromDefaultSurveys(
    defaultSurveys: ListSurveyResponse[],
    projectId: number,
    userId: number,
  ): Promise<SurveyResponse[]> {
    const createdSurveys: SurveyResponse[] = [];
    const authenticatedUser = { id: userId } as UserData;

    for (const defaultSurvey of defaultSurveys) {
      const createSurveyDto = this.createSurveyDtoFromDefaultSurvey(
        defaultSurvey,
        projectId,
      );

      createdSurveys.push(
        await this.createSurveyService.create(
          createSurveyDto,
          authenticatedUser,
        ),
      );
    }

    return createdSurveys;
  }

  /**
   * Creates a CreateSurveyDto using a default survey as source.
   *
   * @param {ListSurveyResponse} defaultSurvey - The default survey source.
   * @param {number} projectId - The project id for the new survey.
   * @returns {CreateSurveyDto} The DTO used to create the duplicated survey.
   */
  protected createSurveyDtoFromDefaultSurvey(
    defaultSurvey: ListSurveyResponse,
    projectId: number,
  ): CreateSurveyDto {
    const createSurveyDto = new CreateSurveyDto();
    createSurveyDto.title = defaultSurvey.title;
    createSurveyDto.default = false;
    createSurveyDto.projectId = projectId;
    createSurveyDto.fields = defaultSurvey.fields.map((field) => {
      const createSurveyFieldDto = new CreateSurveyFieldDto();
      createSurveyFieldDto.type = field.type;
      createSurveyFieldDto.label = field.label;
      createSurveyFieldDto.placeholder = field.placeholder;
      createSurveyFieldDto.required = field.required;
      createSurveyFieldDto.order = field.order;
      createSurveyFieldDto.options = (field.options ?? []).map((option) => {
        const createSurveyFieldOptionDto = new CreateSurveyFieldOptionDto();
        createSurveyFieldOptionDto.value = option.value;
        createSurveyFieldOptionDto.order = option.order;

        return createSurveyFieldOptionDto;
      });

      return createSurveyFieldDto;
    });

    return createSurveyDto;
  }
}
