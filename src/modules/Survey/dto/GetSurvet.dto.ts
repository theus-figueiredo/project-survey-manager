import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

/**
 * DTO responsible for validating survey lookup query parameters.
 */
export class GetSurvetDto {
  @ApiProperty({
    example: 1,
    description: 'Survey id to retrieve.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id!: number;

  @ApiPropertyOptional({
    example: true,
    description:
      'When true, loads answers from the survey response linked to the survey.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) {
      return true;
    }

    if (value === 'false' || value === false) {
      return false;
    }

    return value;
  })
  @IsBoolean()
  withResponse?: boolean;
}
