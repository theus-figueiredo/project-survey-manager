import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../entities/Project.entity';
import { ProjectPhasesEnum } from '../enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../enums/ProjectStatus.enum';

/**
 * Response responsible for formatting project data returned by the API.
 */
export class ProjectResponse {
  @ApiProperty({ example: 1 })
  public readonly id: number;

  @ApiProperty({ example: 'EYF Onboarding' })
  public readonly name: string;

  @ApiProperty({ example: 'Projeto inicial de onboarding do cliente.', nullable: true })
  public readonly description: string | null;

  @ApiProperty({ example: 'EYF' })
  public readonly clientName: string;

  @ApiProperty({
    example: {
      email: 'admin.consultant@test.com',
      name: 'Admin Consultant',
    },
    nullable: true,
  })
  public readonly projectLeader: {
    email: string;
    name: string;
  } | null;

  @ApiProperty({ example: '2026-04-16T12:00:00.000Z', nullable: true })
  public readonly startDate: Date | null;

  @ApiProperty({ enum: ProjectPhasesEnum, example: ProjectPhasesEnum.PLANNING })
  public readonly phase: ProjectPhasesEnum;

  @ApiProperty({ example: 3, nullable: true })
  public readonly totalPhases: number | null;

  @ApiProperty({ enum: ProjectStatusEnum, example: ProjectStatusEnum.IN_PROGRESS })
  public readonly status: ProjectStatusEnum;

  @ApiProperty({ example: null, nullable: true })
  public readonly completedAt: Date | null;

  @ApiProperty({ example: '2026-04-16T12:00:00.000Z' })
  public readonly createdAt: Date;

  @ApiProperty({ example: '2026-04-16T12:00:00.000Z' })
  public readonly updatedAt: Date;

  /**
   * ProjectResponse constructor.
   *
   * @param {Project} project - The project entity with its project leader loaded.
   */
  public constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.clientName = project.clientName;
    this.projectLeader = project.projectLeader
      ? {
          email: project.projectLeader.email,
          name: project.projectLeader.name,
        }
      : null;
    this.startDate = project.startDate;
    this.phase = project.phase;
    this.totalPhases = project.totalPhases;
    this.status = project.status;
    this.completedAt = project.completedAt;
    this.createdAt = project.createdAt;
    this.updatedAt = project.updatedAt;
  }

  /**
   * Creates a ProjectResponse from a Project entity.
   *
   * @param {Project} project - The project entity.
   * @returns {ProjectResponse} The formatted project response.
   */
  public static fromProject(project: Project): ProjectResponse {
    return new ProjectResponse(project);
  }
}
