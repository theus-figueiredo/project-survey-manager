import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../entities/Project.entity';
import { ProjectResponse } from './Project.response';

type ListProjectMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/**
 * Response responsible for formatting paginated project lists.
 */
export class ListProjectResponse {
  @ApiProperty({ type: () => [ProjectResponse] })
  public readonly items: ProjectResponse[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 20,
      total: 25,
      totalPages: 2,
    },
  })
  public readonly meta: ListProjectMeta;

  /**
   * ListProjectResponse constructor.
   *
   * @param {ProjectResponse[]} items - The formatted project list.
   * @param {ListProjectMeta} meta - Pagination metadata.
   */
  public constructor(items: ProjectResponse[], meta: ListProjectMeta) {
    this.items = items;
    this.meta = meta;
  }

  /**
   * Creates a ListProjectResponse from project entities.
   *
   * @param {Project[]} projects - Project entities returned by the database.
   * @param {ListProjectMeta} meta - Pagination metadata.
   * @returns {ListProjectResponse} The formatted paginated project response.
   */
  public static fromProjects(
    projects: Project[],
    meta: ListProjectMeta,
  ): ListProjectResponse {
    return new ListProjectResponse(
      projects.map((project) => ProjectResponse.fromProject(project)),
      meta,
    );
  }
}
