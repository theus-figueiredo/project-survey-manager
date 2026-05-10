import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { User } from '../../User/entities/User.entity';
import { UpdateProjectDto } from '../dto/UpdateProject.dto';
import { Project } from '../entities/Project.entity';
import { ProjectResponse } from '../responses/Project.response';
import { GetProjectService } from './GetProject.service';

type UpdateProjectField = Exclude<keyof UpdateProjectDto, 'id' | 'updateFields'>;
type UpdateProjectHandler = (
  project: Project,
  updateProjectDto: UpdateProjectDto,
) => Promise<void> | void;
type DirectProjectField =
  | 'name'
  | 'description'
  | 'clientName'
  | 'phase'
  | 'totalPhases'
  | 'status';

/**
 * Service responsible for updating projects.
 */
@Injectable()
export class UpdateProjectService {
  private readonly updateHandlers: Record<
    UpdateProjectField,
    UpdateProjectHandler
  > = {
    name: (project: Project, updateProjectDto: UpdateProjectDto): void =>
      this.copyField(project, updateProjectDto, 'name'),
    description: (
      project: Project,
      updateProjectDto: UpdateProjectDto,
    ): void => this.copyField(project, updateProjectDto, 'description'),
    clientName: (project: Project, updateProjectDto: UpdateProjectDto): void =>
      this.copyField(project, updateProjectDto, 'clientName'),
    phase: (project: Project, updateProjectDto: UpdateProjectDto): void =>
      this.copyField(project, updateProjectDto, 'phase'),
    totalPhases: (
      project: Project,
      updateProjectDto: UpdateProjectDto,
    ): void => this.copyField(project, updateProjectDto, 'totalPhases'),
    status: (project: Project, updateProjectDto: UpdateProjectDto): void =>
      this.copyField(project, updateProjectDto, 'status'),
    startDate: (project: Project, updateProjectDto: UpdateProjectDto): void => {
      project.startDate = this.toNullableDate(updateProjectDto.startDate);
    },
    completedAt: (
      project: Project,
      updateProjectDto: UpdateProjectDto,
    ): void => {
      project.completedAt = this.toNullableDate(updateProjectDto.completedAt);
    },
    projectLeaderId: async (
      project: Project,
      updateProjectDto: UpdateProjectDto,
    ): Promise<void> => {
      project.projectLeader = await this.getProjectLeader(
        updateProjectDto.projectLeaderId as number,
      );
    },
  };

  /**
   * UpdateProjectService constructor.
   *
   * @param {Repository<Project>} projectRepository - Repository used to persist projects.
   * @param {Repository<User>} userRepository - Repository used to resolve the project leader.
   * @param {GetProjectService} getProjectService - Service used to retrieve the project being updated.
   */
  public constructor(
    @InjectRepository(Project)
    protected readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
    protected readonly getProjectService: GetProjectService,
  ) {}

  /**
   * Updates a project using only the fields received in the payload.
   *
   * @param {UpdateProjectDto} updateProjectDto - DTO containing project update data.
   * @returns {Promise<ProjectResponse>} A promise that resolves to the updated project response.
   *
   * @throws {NotFoundException} Throws when the project or project leader cannot be found.
   */
  public async update(
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const project = await this.getProjectService.getEntity(updateProjectDto.id);

    await this.applyUpdates(project, updateProjectDto);

    const savedProject = await this.projectRepository.save(project);

    return ProjectResponse.fromProject(savedProject);
  }

  /**
   * Applies received update fields to a project entity.
   *
   * @param {Project} project - Project entity to update.
   * @param {UpdateProjectDto} updateProjectDto - DTO containing update data.
   * @returns {Promise<void>} A promise that resolves after applying update data.
   */
  protected async applyUpdates(
    project: Project,
    updateProjectDto: UpdateProjectDto,
  ): Promise<void> {
    for (const field of this.getReceivedUpdateFields(updateProjectDto)) {
      await this.updateHandlers[field](project, updateProjectDto);
    }
  }

  /**
   * Resolves the project leader by id.
   *
   * @param {number} projectLeaderId - The project leader user id.
   * @returns {Promise<User>} A promise that resolves to the project leader user.
   *
   * @throws {NotFoundException} Throws when the project leader cannot be found.
   */
  protected async getProjectLeader(projectLeaderId: number): Promise<User> {
    const projectLeader = await this.userRepository.findOne({
      where: { id: projectLeaderId },
    });

    if (!projectLeader) {
      throw new NotFoundException(
        'Project leader not found',
        'Líder do projeto não encontrado',
        { projectLeaderId },
      );
    }

    return projectLeader;
  }

  /**
   * Checks if a field was explicitly received in the update payload.
   *
   * @param {UpdateProjectDto} updateProjectDto - DTO containing update data.
   * @param {keyof UpdateProjectDto} field - Field to check.
   * @returns {boolean} Whether the field was received in the payload.
   */
  protected hasField(
    updateProjectDto: UpdateProjectDto,
    field: keyof UpdateProjectDto,
  ): boolean {
    return Object.prototype.hasOwnProperty.call(updateProjectDto, field);
  }

  /**
   * Retrieves all update fields explicitly received in the payload.
   *
   * @param {UpdateProjectDto} updateProjectDto - DTO containing update data.
   * @returns {UpdateProjectField[]} The update fields received in the payload.
   */
  protected getReceivedUpdateFields(
    updateProjectDto: UpdateProjectDto,
  ): UpdateProjectField[] {
    return Object.keys(this.updateHandlers).filter(
      (field: string): field is UpdateProjectField =>
        this.hasField(updateProjectDto, field as keyof UpdateProjectDto),
    );
  }

  /**
   * Copies a direct project field from the update DTO to the project entity.
   *
   * @param {Project} project - Project entity to update.
   * @param {UpdateProjectDto} updateProjectDto - DTO containing update data.
   * @param {DirectProjectField} field - Field to copy.
   * @returns {void}
   */
  protected copyField(
    project: Project,
    updateProjectDto: UpdateProjectDto,
    field: DirectProjectField,
  ): void {
    Object.assign(project, {
      [field]: updateProjectDto[field],
    });
  }

  /**
   * Converts an optional nullable date string to a nullable Date.
   *
   * @param {string | null | undefined} value - Date payload value.
   * @returns {Date | null} The converted date or null.
   */
  protected toNullableDate(value: string | null | undefined): Date | null {
    return value ? new Date(value) : null;
  }
}
