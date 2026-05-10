import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ClientException } from '../../../common/errors/Client.exception';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { Project } from '../../Project/entities/Project.entity';
import { CreateSurveyFieldService } from '../../SurveyField/services/CreateSurveyField.service';
import { GetUserService } from '../../User/services/GetUser.service';
import { UserData } from '../../Auth/types/UserData.type';
import { CreateSurveyDto } from '../dto/CreateSurvey.dto';
import { Survey } from '../entities/Survey.entity';
import { SurveyResponse } from '../responses/Survey.response';

/**
 * Service responsible for creating surveys with fields and options.
 */
@Injectable()
export class CreateSurveyService {
  /**
   * CreateSurveyService constructor.
   *
   * @param {DataSource} dataSource - Data source used to run the creation transaction.
   * @param {GetUserService} getUserService - Service used to resolve the authenticated user.
   * @param {CreateSurveyFieldService} createSurveyFieldService - Service used to create survey fields.
   */
  public constructor(
    protected readonly dataSource: DataSource,
    protected readonly getUserService: GetUserService,
    protected readonly createSurveyFieldService: CreateSurveyFieldService,
  ) {}

  /**
   * Creates a survey with its fields and field options.
   *
   * @param {CreateSurveyDto} createSurveyDto - DTO containing survey, field, and option data.
   * @param {UserData} authenticatedUser - The authenticated user creating the survey.
   * @returns {Promise<SurveyResponse>} A promise that resolves to the created survey response.
   * @throws {ClientException} Throws when project or field rules are invalid.
   * @throws {NotFoundException} Throws when referenced projects are not found.
   */
  public async create(
    createSurveyDto: CreateSurveyDto,
    authenticatedUser: UserData,
  ): Promise<SurveyResponse> {
    const createdBy = await this.getUserService.getById(authenticatedUser.id);

    return await this.dataSource.transaction(
      async (manager: EntityManager): Promise<SurveyResponse> => {
        const project = await this.resolveProject(
          createSurveyDto.projectId,
          createSurveyDto.default === true,
          manager,
        );
        const projects = project ? [project] : [];

        const surveyRepository = manager.getRepository(Survey);
        const survey = surveyRepository.create({
          title: createSurveyDto.title,
          default: createSurveyDto.default ?? null,
          createdBy,
          projects,
        });

        const savedSurvey = await surveyRepository.save(survey);
        const fields = await this.createSurveyFieldService.createMany(
          savedSurvey,
          createSurveyDto.fields,
          manager,
        );

        savedSurvey.projects = projects;

        return SurveyResponse.fromSurvey(savedSurvey, fields);
      },
    );
  }

  /**
   * Resolves a project id into a project entity and validates default survey rules.
   *
   * @param {number | null | undefined} projectId - Project id to resolve.
   * @param {boolean} isDefaultSurvey - Whether the survey is marked as default.
   * @param {EntityManager} manager - Transactional entity manager.
   * @returns {Promise<Project | null>} A promise that resolves to the project entity or null.
   * @throws {ClientException} Throws when a non-default survey has no project.
   * @throws {NotFoundException} Throws when the project id cannot be found.
   */
  private async resolveProject(
    projectId: number | null | undefined,
    isDefaultSurvey: boolean,
    manager: EntityManager,
  ): Promise<Project | null> {
    if (!isDefaultSurvey && !projectId) {
      throw new ClientException(
        'Project id is required for non-default surveys',
        'Projeto é obrigatório para surveys não padrão',
        null,
      );
    }

    if (!projectId) {
      return null;
    }

    const projectRepository = manager.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
        'Projeto não encontrado',
        { projectId },
      );
    }

    return project;
  }
}
