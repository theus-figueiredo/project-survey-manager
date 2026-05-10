import { ApiProperty } from '@nestjs/swagger';
import { PositionsEnum } from '../../User/enums/Positions.enum';
import { RolesEnum } from '../../User/enums/Roles.enum';

/**
 * Response responsible for documenting registered user data returned by the API.
 */
export class RegisterResponse {
  @ApiProperty({ example: 1 })
  public readonly id!: number;

  @ApiProperty({ example: 'admin.consultant@test.com' })
  public readonly email!: string;

  @ApiProperty({ example: 'Admin Consultant' })
  public readonly name!: string;

  @ApiProperty({ enum: RolesEnum, example: RolesEnum.ADMIN })
  public readonly role!: RolesEnum;

  @ApiProperty({ enum: PositionsEnum, example: PositionsEnum.CONSULTANT })
  public readonly position!: PositionsEnum;

  @ApiProperty({ example: '2026-04-12T12:00:00.000Z' })
  public readonly createdAt!: Date;

  @ApiProperty({ example: '2026-04-12T12:00:00.000Z' })
  public readonly updatedAt!: Date;
}
