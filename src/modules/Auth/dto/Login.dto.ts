import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object used for login requests.
 */
export class LoginDto {
  @ApiProperty({
    example: 'admin.consultant@test.com',
    description: 'User email used to authenticate.',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password',
    description: 'User password.',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
