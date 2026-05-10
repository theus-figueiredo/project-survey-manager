import { Injectable } from '@nestjs/common';
import { UserData } from '../../Auth/types/UserData.type';
import { CreateProjectDto } from '../dto/CreateProject.dto';
import { ProjectResponse } from '../responses/Project.response';
import { CreateProjectService } from './CreateProject.service';
import { DuplicateGlobalSurveyToProjectService } from './DuplicateGblobalSurveyToProject.service';

/**
 * Service responsible for orchestrating complete project creation.
 */
@Injectable()
export class AddNewProjectService {
  /**
   * AddNewProjectService constructor.
   *
   * @param {CreateProjectService} createProjectService - Service used to create the project.
   * @param {DuplicateGlobalSurveyToProjectService} duplicateGlobalSurveyToProjectService - Service used to duplicate default surveys.
   */
  public constructor(
    protected readonly createProjectService: CreateProjectService,
    protected readonly duplicateGlobalSurveyToProjectService: DuplicateGlobalSurveyToProjectService,
  ) {}

  /**
   * Creates a project and duplicates the default surveys into it.
   *
   * @param {CreateProjectDto} createProjectDto - DTO containing project creation data.
   * @param {UserData} authenticatedUser - The authenticated user creating the project.
   * @returns {Promise<ProjectResponse>} A promise that resolves to the created project response.
   */
  public async add(createProjectDto: CreateProjectDto, authenticatedUser: UserData,): Promise<ProjectResponse> {
    const project = await this.createProjectService.create(createProjectDto);

    await this.duplicateGlobalSurveyToProjectService.duplicateToProject(
      project.id,
      authenticatedUser.id,
    );

    return ProjectResponse.fromProject(project);
  }
}
