import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSurveyFieldOptionDto } from '../../SurveyFieldOption/dto/CreateSurveyFieldOption.dto';
import { SurveyFieldTypesEnum } from '../enums/SurveyFieldTypes.enum';

/**
 * DTO responsible for validating survey field creation payloads.
 */
export class CreateSurveyFieldDto {
  @ApiProperty({
    enum: SurveyFieldTypesEnum,
    example: SurveyFieldTypesEnum.SELECT,
    description: 'Survey field type.',
  })
  @IsEnum(SurveyFieldTypesEnum)
  type!: SurveyFieldTypesEnum;

  @ApiProperty({
    example: 'Como voce conheceu a empresa?',
    description: 'Survey field label.',
  })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiPropertyOptional({
    example: null,
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

  @ApiProperty({
    example: 1,
    description: 'Display order of the field in the survey.',
  })
  @IsInt()
  order!: number;

  @ApiPropertyOptional({
    type: () => [CreateSurveyFieldOptionDto],
    nullable: true,
    description: 'Options used by SELECT, CHECKBOX, or RADIO fields.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyFieldOptionDto)
  options?: CreateSurveyFieldOptionDto[] | null;
}
