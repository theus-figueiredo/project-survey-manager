import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

/**
 * DTO responsible for validating survey response creation payloads.
 */
export class CreateSurveyResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Survey id being answered.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  surveyId!: number;
}
