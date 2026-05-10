import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { HasSurveyUpdateFields } from '../validators/UpdateSurveyPayload.validator';

/**
 * DTO responsible for validating survey update payloads.
 */
export class UpdateSurveyDto {
  @ApiProperty({
    example: 10,
    description: 'Survey id to update.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;

  @ApiPropertyOptional({
    example: 'Pesquisa atualizada',
    description: 'Survey title.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    example: false,
    nullable: true,
    description: 'Indicates whether the survey is a default survey.',
  })
  @IsOptional()
  @IsBoolean()
  default?: boolean | null;

  @ApiPropertyOptional({
    example: 2,
    nullable: true,
    description: 'Project id associated with the survey when it is not default.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId?: number | null;

  @HasSurveyUpdateFields()
  protected readonly updateFields?: boolean;
}
