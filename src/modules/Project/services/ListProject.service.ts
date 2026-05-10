import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ListProjectDto } from '../dto/ListProject.dto';
import { Project } from '../entities/Project.entity';
import { ListProjectResponse } from '../responses/ListProject.response';

const defaultPage = 1;
const defaultLimit = 20;

/**
 * Service responsible for listing projects with filters and pagination.
 */
@Injectable()
export class ListProjectService {
  /**
   * ListProjectService constructor.
   *
   * @param {Repository<Project>} projectRepository - Repository used to query projects.
   */
  public constructor(
    @InjectRepository(Project)
    protected readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Lists projects using the provided filters and pagination options.
   *
   * @param {ListProjectDto} dto - DTO containing list filters and pagination values.
   * @returns {Promise<ListProjectResponse>} A promise that resolves to the paginated project list.
   */
  public async list(dto: ListProjectDto): Promise<ListProjectResponse> {
    const page = dto.page ?? defaultPage;
    const limit = dto.limit ?? defaultLimit;
    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.projectLeader', 'projectLeader')
      .orderBy('project.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (dto.all !== true) {
      this.applyFilters(query, dto);
    }

    const [projects, total] = await query.getManyAndCount();

    return ListProjectResponse.fromProjects(projects, {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    });
  }

  /**
   * Applies project list filters to the query builder.
   *
   * @param {SelectQueryBuilder<Project>} query - Query builder used to list projects.
   * @param {ListProjectDto} dto - DTO containing list filters.
   */
  protected applyFilters(
    query: SelectQueryBuilder<Project>,
    dto: ListProjectDto,
  ): void {
    const filters = [
      'customer',
      'projectLeaderId',
      'phase',
      'status',
    ] as const;

    for (const filter of filters) {
      switch (filter) {
        case 'customer':
          if (dto.customer) {
            query.andWhere('project.clientName ILIKE :customer', {
              customer: `%${dto.customer}%`,
            });
          }
          break;
        case 'projectLeaderId':
          if (dto.projectLeaderId) {
            query.andWhere('projectLeader.id = :projectLeaderId', {
              projectLeaderId: dto.projectLeaderId,
            });
          }
          break;
        case 'phase':
          if (dto.phase) {
            query.andWhere('project.phase = :phase', { phase: dto.phase });
          }
          break;
        case 'status':
          if (dto.status) {
            query.andWhere('project.status = :status', { status: dto.status });
          }
          break;
        default:
          break;
      }
    }
  }
}
