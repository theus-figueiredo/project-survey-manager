import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { IsValidListSurveyQuery } from '../validators/ListSurveyQuery.validator';

/**
 * DTO responsible for validating survey list query parameters.
 */
export class ListSurveyDto {
  @ApiPropertyOptional({
    example: true,
    description:
      'When true, lists default surveys. When false, projectId is required.',
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
  default?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Project id used to list surveys associated with a project.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  projectId?: number;

  @IsValidListSurveyQuery()
  protected readonly filters?: boolean;
}
