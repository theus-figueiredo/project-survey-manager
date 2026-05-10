import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { User } from '../../User/entities/User.entity';
import { AddUsersToProjectDto } from '../dto/AddUsersToProject.dto';
import { Project } from '../entities/Project.entity';
import { ProjectWithUsersResponse } from '../responses/ProjectWithUsers.response';

/**
 * Service responsible for adding users to projects.
 */
@Injectable()
export class AddUsersToProjectService {
  /**
   * AddUsersToProjectService constructor.
   *
   * @param {Repository<Project>} projectRepository - Repository used to query and persist projects.
   * @param {Repository<User>} userRepository - Repository used to query users.
   */
  public constructor(
    @InjectRepository(Project)
    protected readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  /**
   * Adds users to a project without removing existing associations.
   *
   * @param {AddUsersToProjectDto} addUsersToProjectDto - DTO containing project and user ids.
   * @returns {Promise<ProjectWithUsersResponse>} A promise that resolves to the project with users.
   */
  public async add(
    addUsersToProjectDto: AddUsersToProjectDto,
  ): Promise<ProjectWithUsersResponse> {
    const project = await this.getProject(addUsersToProjectDto.projectId);
    const userIds = this.uniqueIds(addUsersToProjectDto.userIds);
    const users = await this.getUsers(userIds);

    project.users = this.mergeUsers(project.users ?? [], users);

    const savedProject = await this.projectRepository.save(project);

    savedProject.users = project.users;

    return ProjectWithUsersResponse.fromProject(savedProject);
  }

  /**
   * Retrieves the project that will receive users.
   *
   * @param {number} projectId - Project id.
   * @returns {Promise<Project>} A promise that resolves to the project entity.
   */
  protected async getProject(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: {
        users: true,
      },
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

  /**
   * Retrieves all users by id, ensuring every requested user exists.
   *
   * @param {number[]} userIds - User ids to retrieve.
   * @returns {Promise<User[]>} A promise that resolves to the user entities.
   */
  protected async getUsers(userIds: number[]): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        id: In(userIds),
      },
    });
    const foundUserIds = new Set<number>(users.map((user: User) => user.id));
    const missingUserIds = userIds.filter(
      (userId: number): boolean => !foundUserIds.has(userId),
    );

    if (missingUserIds.length > 0) {
      throw new NotFoundException(
        'Users not found',
        'Usuários não encontrados',
        { userIds: missingUserIds },
      );
    }

    return users;
  }

  /**
   * Removes duplicated ids preserving first occurrence order.
   *
   * @param {number[]} ids - Id list to normalize.
   * @returns {number[]} Unique ids.
   */
  protected uniqueIds(ids: number[]): number[] {
    return [...new Set<number>(ids)];
  }

  /**
   * Merges current and new users without duplicating associations.
   *
   * @param {User[]} currentUsers - Users already associated with the project.
   * @param {User[]} usersToAssociate - Users requested to be added.
   * @returns {User[]} Merged users.
   */
  protected mergeUsers(
    currentUsers: User[],
    usersToAssociate: User[],
  ): User[] {
    const usersById = new Map<number, User>();

    [...currentUsers, ...usersToAssociate].forEach((user: User): void => {
      usersById.set(user.id, user);
    });

    return [...usersById.values()];
  }
}
