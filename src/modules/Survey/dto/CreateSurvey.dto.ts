import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSurveyFieldDto } from '../../SurveyField/dto/CreateSurveyField.dto';

/**
 * DTO responsible for validating survey creation payloads.
 */
export class CreateSurveyDto {
  @ApiProperty({
    example: 'Pesquisa de onboarding',
    description: 'Survey title.',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: false,
    nullable: true,
    description: 'Indicates whether the survey is a default survey.',
  })
  @IsOptional()
  @IsBoolean()
  default?: boolean | null;

  @ApiPropertyOptional({
    example: 1,
    nullable: true,
    description: 'Project id associated with the survey when it is not default.',
  })
  @IsOptional()
  @IsInt()
  projectId?: number | null;

  @ApiProperty({
    type: () => [CreateSurveyFieldDto],
    description: 'Fields created together with the survey.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyFieldDto)
  fields!: CreateSurveyFieldDto[];
}
