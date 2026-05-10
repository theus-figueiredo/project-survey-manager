import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

/**
 * DTO responsible for validating project lookup query parameters.
 */
export class GetProjectByIdDto {
  @ApiProperty({
    example: 1,
    description: 'Project id to retrieve.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id!: number;
}
