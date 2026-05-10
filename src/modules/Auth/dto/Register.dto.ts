import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PositionsEnum } from '../../User/enums/Positions.enum';
import { RolesEnum } from '../../User/enums/Roles.enum';

/**
 * DTO responsible for validating the payload used to register a new user.
 */
export class RegisterDto {
  @ApiProperty({
    example: 'admin.consultant@test.com',
    description: 'Email used by the user to login.',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password',
    description: 'Plain password that will be hashed before persistence.',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    example: 'Admin Consultant',
    description: 'User full name.',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    enum: RolesEnum,
    example: RolesEnum.ADMIN,
    description: 'User role.',
  })
  @IsEnum(RolesEnum)
  @IsNotEmpty()
  role!: RolesEnum;

  @ApiProperty({
    enum: PositionsEnum,
    example: PositionsEnum.CONSULTANT,
    description: 'User position.',
  })
  @IsEnum(PositionsEnum)
  @IsNotEmpty()
  position!: PositionsEnum;
}
