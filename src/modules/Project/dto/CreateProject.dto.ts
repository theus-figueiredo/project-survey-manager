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

/**
 * DTO responsible for validating project creation payloads.
 */
export class CreateProjectDto {
  @ApiProperty({
    example: 'EYF Onboarding',
    description: 'Project name.',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Projeto inicial de onboarding do cliente.',
    nullable: true,
    description: 'Optional project description.',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    example: 'EYF',
    description: 'Client name associated with the project.',
  })
  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @ApiProperty({
    example: 1,
    description: 'User id that will be assigned as project leader.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectLeaderId!: number;

  @ApiPropertyOptional({
    example: '2026-04-16T12:00:00.000Z',
    nullable: true,
    description: 'Optional project start date.',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @ApiProperty({
    enum: ProjectPhasesEnum,
    example: ProjectPhasesEnum.PLANNING,
    description: 'Project lifecycle phase.',
  })
  @IsEnum(ProjectPhasesEnum)
  phase!: ProjectPhasesEnum;

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

  @ApiProperty({
    enum: ProjectStatusEnum,
    example: ProjectStatusEnum.IN_PROGRESS,
    description: 'Project operational status.',
  })
  @IsEnum(ProjectStatusEnum)
  status!: ProjectStatusEnum;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Optional date when the project was completed.',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: string | null;
}
