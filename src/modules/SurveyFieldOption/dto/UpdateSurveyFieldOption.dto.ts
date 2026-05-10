import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { HasSurveyFieldOptionUpdateFields } from '../validators/UpdateSurveyFieldOptionPayload.validator';

/**
 * DTO responsible for validating survey field option update payloads.
 */
export class UpdateSurveyFieldOptionDto {
  @ApiProperty({
    example: 21,
    description: 'Survey field option id to update.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;

  @ApiPropertyOptional({
    example: 'Google Ads',
    description: 'Option value displayed to the user.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  value?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order of the option inside its field.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order?: number;

  @HasSurveyFieldOptionUpdateFields()
  protected readonly updateFields?: boolean;
}
