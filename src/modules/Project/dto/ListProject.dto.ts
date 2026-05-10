import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ProjectPhasesEnum } from '../enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../enums/ProjectStatus.enum';

/**
 * DTO responsible for validating project list query parameters.
 */
export class ListProjectDto {
  @ApiPropertyOptional({
    example: 'EYF',
    description: 'Client name used to filter projects.',
  })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Project leader id used to filter projects.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  projectLeaderId?: number;

  @ApiPropertyOptional({
    enum: ProjectPhasesEnum,
    example: ProjectPhasesEnum.PLANNING,
    description: 'Project phase used to filter projects.',
  })
  @IsOptional()
  @IsEnum(ProjectPhasesEnum)
  phase?: ProjectPhasesEnum;

  @ApiPropertyOptional({
    enum: ProjectStatusEnum,
    example: ProjectStatusEnum.IN_PROGRESS,
    description: 'Project status used to filter projects.',
  })
  @IsOptional()
  @IsEnum(ProjectStatusEnum)
  status?: ProjectStatusEnum;

  @ApiPropertyOptional({
    example: false,
    description: 'When true, ignores filters but still applies pagination.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) {
      return true;
    }

    if (value === 'false' || value === false) {
      return false;
    }

    return value;
  })
  @IsBoolean()
  all?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number used for pagination.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of items returned per page.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;
}
