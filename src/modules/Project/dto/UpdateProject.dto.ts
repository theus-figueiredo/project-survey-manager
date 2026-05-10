import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProjectPhasesEnum } from '../enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../enums/ProjectStatus.enum';
import { HasProjectUpdateFields } from '../validators/UpdateProjectPayload.validator';

/**
 * DTO responsible for validating project update payloads.
 */
export class UpdateProjectDto {
  @ApiProperty({
    example: 1,
    description: 'Project id to update.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;

  @ApiPropertyOptional({
    example: 'EYF Onboarding atualizado',
    description: 'Project name.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: 'Projeto inicial de onboarding do cliente.',
    nullable: true,
    description: 'Optional project description.',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    example: 'EYF',
    description: 'Client name associated with the project.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  clientName?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'User id that will be assigned as project leader.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectLeaderId?: number;

  @ApiPropertyOptional({
    example: '2026-04-16T12:00:00.000Z',
    nullable: true,
    description: 'Optional project start date.',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @ApiPropertyOptional({
    enum: ProjectPhasesEnum,
    example: ProjectPhasesEnum.PLANNING,
    description: 'Project lifecycle phase.',
  })
  @IsOptional()
  @IsEnum(ProjectPhasesEnum)
  phase?: ProjectPhasesEnum;

  @ApiPropertyOptional({
    example: 3,
    nullable: true,
    description: 'Optional total number of project phases.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalPhases?: number | null;

  @ApiPropertyOptional({
    enum: ProjectStatusEnum,
    example: ProjectStatusEnum.IN_PROGRESS,
    description: 'Project operational status.',
  })
  @IsOptional()
  @IsEnum(ProjectStatusEnum)
  status?: ProjectStatusEnum;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Optional date when the project was completed.',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: string | null;

  @HasProjectUpdateFields()
  protected readonly updateFields?: boolean;
}
