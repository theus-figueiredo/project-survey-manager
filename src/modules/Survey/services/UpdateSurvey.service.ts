import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientException } from '../../../common/errors/Client.exception';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { Project } from '../../Project/entities/Project.entity';
import { UpdateSurveyDto } from '../dto/UpdateSurvey.dto';
import { Survey } from '../entities/Survey.entity';
import { SurveyResponse } from '../responses/Survey.response';

/**
 * Service responsible for updating surveys.
 */
@Injectable()
export class UpdateSurveyService {
  /**
   * UpdateSurveyService constructor.
   *
   * @param {Repository<Survey>} surveyRepository - Repository used to query and persist surveys.
   * @param {Repository<Project>} projectRepository - Repository used to resolve survey projects.
   */
  public constructor(
    @InjectRepository(Survey)
    protected readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Project)
    protected readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Updates a survey using only the fields received in the payload.
   *
   * @param {UpdateSurveyDto} updateSurveyDto - DTO containing survey update data.
   * @returns {Promise<SurveyResponse>} A promise that resolves to the updated survey response.
   */
  public async update(updateSurveyDto: UpdateSurveyDto): Promise<SurveyResponse> {
    const survey = await this.getSurvey(updateSurveyDto.id);

    await this.applyUpdates(survey, updateSurveyDto);

    const savedSurvey = await this.surveyRepository.save(survey);

    return SurveyResponse.fromSurveyWithRelations(savedSurvey);
  }

  /**
   * Retrieves the survey to update with relations needed by the response.
   *
   * @param {number} id - Survey id.
   * @returns {Promise<Survey>} A promise that resolves to the survey entity.
   */
  protected async getSurvey(id: number): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
        projects: true,
        fields: {
          options: true,
        },
      },
      order: {
        fields: {
          order: 'ASC',
          options: {
            order: 'ASC',
          },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException(
        'Survey not found',
        'Survey não encontrada',
        { id },
      );
    }

    return survey;
  }

  /**
   * Applies received update fields to a survey entity.
   *
   * @param {Survey} survey - Survey entity to update.
   * @param {UpdateSurveyDto} updateSurveyDto - DTO containing update data.
   * @returns {Promise<void>} A promise that resolves after applying update data.
   */
  protected async applyUpdates(
    survey: Survey,
    updateSurveyDto: UpdateSurveyDto,
  ): Promise<void> {
    if (this.hasField(updateSurveyDto, 'title')) {
      survey.title = updateSurveyDto.title as string;
    }

    if (this.hasField(updateSurveyDto, 'default')) {
      survey.default = updateSurveyDto.default ?? null;
    }

    if (this.hasField(updateSurveyDto, 'projectId')) {
      survey.projects = await this.resolveProjects(
        updateSurveyDto.projectId,
        survey.default === true,
      );
    }
  }

  /**
   * Resolves the survey project update into a project relation list.
   *
   * @param {number | null | undefined} projectId - Project id received in the payload.
   * @param {boolean} isDefaultSurvey - Whether the survey is marked as default after updates.
   * @returns {Promise<Project[]>} A promise that resolves to the survey project list.
   */
  protected async resolveProjects(
    projectId: number | null | undefined,
    isDefaultSurvey: boolean,
  ): Promise<Project[]> {
    if (projectId === null) {
      if (!isDefaultSurvey) {
        throw new ClientException(
          'Project cannot be removed from non-default survey',
          'Projeto não pode ser removido de uma survey não padrão',
          null,
        );
      }

      return [];
    }

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
        'Projeto não encontrado',
        { projectId },
      );
    }

    return [project];
  }

  /**
   * Checks if a field was explicitly received in the update payload.
   *
   * @param {UpdateSurveyDto} updateSurveyDto - DTO containing update data.
   * @param {keyof UpdateSurveyDto} field - Field to check.
   * @returns {boolean} Whether the field was received in the payload.
   */
  protected hasField(
    updateSurveyDto: UpdateSurveyDto,
    field: keyof UpdateSurveyDto,
  ): boolean {
    return Object.prototype.hasOwnProperty.call(updateSurveyDto, field);
  }
}
