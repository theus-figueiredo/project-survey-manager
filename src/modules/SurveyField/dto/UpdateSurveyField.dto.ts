import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SurveyFieldTypesEnum } from '../enums/SurveyFieldTypes.enum';
import { HasSurveyFieldUpdateFields } from '../validators/UpdateSurveyFieldPayload.validator';

/**
 * DTO responsible for validating survey field update payloads.
 */
export class UpdateSurveyFieldDto {
  @ApiProperty({
    example: 19,
    description: 'Survey field id to update.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;

  @ApiPropertyOptional({
    enum: SurveyFieldTypesEnum,
    example: SurveyFieldTypesEnum.TEXT,
    description: 'Survey field type.',
  })
  @IsOptional()
  @IsEnum(SurveyFieldTypesEnum)
  type?: SurveyFieldTypesEnum;

  @ApiPropertyOptional({
    example: 'Nome completo atualizado',
    description: 'Survey field label.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @ApiPropertyOptional({
    example: 'Digite seu nome',
    nullable: true,
    description: 'Optional placeholder displayed for the field.',
  })
  @IsOptional()
  @IsString()
  placeholder?: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates whether the field is required.',
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order of the field in the survey.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order?: number;

  @HasSurveyFieldUpdateFields()
  protected readonly updateFields?: boolean;
}
