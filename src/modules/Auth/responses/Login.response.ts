import { ApiProperty } from '@nestjs/swagger';

/**
 * Response responsible for documenting login data returned by the API.
 */
export class LoginResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token used to authenticate protected requests.',
  })
  public readonly token!: string;
}
