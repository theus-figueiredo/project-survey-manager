import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CreateSurveyResponseAnswerItemDto } from './CreateSurveyResponseAnswerItem.dto';

/**
 * DTO responsible for validating bulk survey response answers creation payloads.
 */
export class CreateSurveyResponseAnswersBulkDto {
  @ApiProperty({
    example: 1,
    description: 'Survey response id that owns the answers.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  surveyResponseId!: number;

  @ApiProperty({
    type: () => [CreateSurveyResponseAnswerItemDto],
    description: 'Answers to be created for the survey response.',
  })
  @Type(() => CreateSurveyResponseAnswerItemDto)
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  answers!: CreateSurveyResponseAnswerItemDto[];
}
