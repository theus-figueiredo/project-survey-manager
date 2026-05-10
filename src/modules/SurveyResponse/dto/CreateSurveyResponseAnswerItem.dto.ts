import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

/**
 * DTO responsible for validating a single survey response answer item.
 */
export class CreateSurveyResponseAnswerItemDto {
  @ApiPropertyOptional({
    example: 10,
    description: 'Survey field id being answered.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  fieldId!: number;

  @ApiPropertyOptional({
    example: 'João da Silva',
    description: 'Free text value for text-like fields.',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  value?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Selected option id for SELECT and RADIO fields.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  optionId?: number;

  @ApiPropertyOptional({
    example: [7, 8, 9],
    description: 'Selected option ids for CHECKBOX fields.',
  })
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  optionIds?: number[];
}
