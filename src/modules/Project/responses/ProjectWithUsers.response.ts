import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../User/entities/User.entity';
import { PositionsEnum } from '../../User/enums/Positions.enum';
import { Project } from '../entities/Project.entity';

/**
 * Response responsible for formatting project data with associated users.
 */
export class ProjectWithUsersResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({ example: 'EYF Growth' })
  public readonly name: string;

  @ApiProperty({
    example: [
      {
        id: 3,
        name: 'User Consultant',
        email: 'user.consultant@test.com',
        position: PositionsEnum.CONSULTANT,
      },
    ],
  })
  public readonly users: Array<{
    id: number;
    name: string;
    email: string;
    position: PositionsEnum;
  }>;

  /**
   * ProjectWithUsersResponse constructor.
   *
   * @param {Project} project - The project entity with users loaded.
   */
  public constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.users = (project.users ?? []).map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      position: user.position,
    }));
  }

  /**
   * Creates a ProjectWithUsersResponse from a Project entity.
   *
   * @param {Project} project - The project entity.
   * @returns {ProjectWithUsersResponse} The formatted project with users response.
   */
  public static fromProject(project: Project): ProjectWithUsersResponse {
    return new ProjectWithUsersResponse(project);
  }
}
