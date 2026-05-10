import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { CreateSurveyResponseAnswerItemDto } from './CreateSurveyResponseAnswerItem.dto';

/**
 * DTO responsible for validating single survey response answer creation payloads.
 */
export class CreateSurveyResponseAnswerDto extends CreateSurveyResponseAnswerItemDto {
  @ApiProperty({
    example: 1,
    description: 'Survey response id that owns the answer.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  surveyResponseId!: number;
}
