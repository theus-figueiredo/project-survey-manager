import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { User } from '../../User/entities/User.entity';
import { CreateProjectDto } from '../dto/CreateProject.dto';
import { Project } from '../entities/Project.entity';

/**
 * Service responsible for creating projects.
 */
@Injectable()
export class CreateProjectService {
  /**
   * CreateProjectService constructor.
   *
   * @param {Repository<Project>} projectRepository - Repository used to persist projects.
   * @param {Repository<User>} userRepository - Repository used to resolve the project leader.
   */
  public constructor(
    @InjectRepository(Project)
    protected readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a project in the database.
   *
   * @param {CreateProjectDto} createProjectDto - DTO containing project creation data.
   * @returns {Promise<Project>} A promise that resolves to the created project.
   *
   * @throws {NotFoundException} Throws when the project leader cannot be found.
   */
  public async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const projectLeader = await this.getProjectLeader(
      createProjectDto.projectLeaderId,
    );

    const project = this.projectRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description ?? null,
      clientName: createProjectDto.clientName,
      projectLeader,
      startDate: createProjectDto.startDate
        ? new Date(createProjectDto.startDate)
        : null,
      phase: createProjectDto.phase,
      totalPhases: createProjectDto.totalPhases ?? null,
      status: createProjectDto.status,
      completedAt: createProjectDto.completedAt
        ? new Date(createProjectDto.completedAt)
        : null,
    });

    const savedProject = await this.projectRepository.save(project);
    savedProject.projectLeader = projectLeader;

    return savedProject;
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
}
