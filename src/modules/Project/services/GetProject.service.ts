import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { Project } from '../entities/Project.entity';
import { ProjectResponse } from '../responses/Project.response';

/**
 * Service responsible for retrieving projects.
 */
@Injectable()
export class GetProjectService {
  /**
   * GetProjectService constructor.
   *
   * @param {Repository<Project>} projectRepository - Repository used to query projects.
   */
  public constructor(
    @InjectRepository(Project)
    protected readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Retrieves a project by id with its related project leader.
   *
   * @param {number} id - The project id to retrieve.
   * @returns {Promise<ProjectResponse>} A promise that resolves to the formatted project response.
   * @throws {NotFoundException} Throws when the project cannot be found.
   */
  public async get(id: number): Promise<ProjectResponse> {
    const project = await this.getEntity(id);

    return ProjectResponse.fromProject(project);
  }

  /**
   * Retrieves a project entity by id with its related project leader.
   *
   * @param {number} id - The project id to retrieve.
   * @returns {Promise<Project>} A promise that resolves to the project entity.
   * @throws {NotFoundException} Throws when the project cannot be found.
   */
  public async getEntity(id: number): Promise<Project> {
    try {
      return await this.projectRepository.findOneOrFail({
        where: { id },
        relations: {
          projectLeader: true,
        },
      });
    } catch (error) {
      if (!(error instanceof EntityNotFoundError)) {
        throw error;
      }

      throw new NotFoundException('Project not found', 'Projeto não encontrado', {id});
    }
  }
}
