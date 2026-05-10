import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO responsible for validating survey field option creation payloads.
 */
export class CreateSurveyFieldOptionDto {
  @ApiProperty({
    example: 'Google',
    description: 'Option value displayed to the user.',
  })
  @IsString()
  @IsNotEmpty()
  value!: string;

  @ApiProperty({
    example: 1,
    description: 'Display order of the option inside its field.',
  })
  @IsInt()
  order!: number;
}
