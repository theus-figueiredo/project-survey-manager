import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

/**
 * DTO responsible for validating project add users payloads.
 */
export class AddUsersToProjectDto {
  @ApiProperty({
    example: 1,
    description: 'Project id that will receive the users.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId!: number;

  @ApiProperty({
    example: [3, 4, 5],
    description: 'User ids to add to the project.',
  })
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  userIds!: number[];
}
