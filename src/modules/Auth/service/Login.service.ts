import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/Jwt.config';
import { LoginDto } from '../dto/Login.dto';
import { HashingService } from '../abstract/Hashing.service';
import { GetUserService } from '../../User/services/GetUser.service';
import { UnauthorizedException } from '../../../common/errors/Unauthorized.exception';

/**
 * Service responsible for validating credentials and issuing JWT tokens.
 */
@Injectable()
export class LoginService {
  /**
   * LoginService constructor.
   *
   * @param {GetUserService} getUserService - Service used to retrieve users by identifier.
   * @param {HashingService} hashingService - Service used to compare passwords.
   * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - JWT configuration values.
   * @param {JwtService} jwtService - Service used to sign JWT tokens.
   */
  public constructor(
    protected readonly getUserService: GetUserService,
    protected readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    protected readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    protected readonly jwtService: JwtService,
  ) {}

  /**
   * Validates the login credentials and returns a signed JWT token.
   *
   * @param {LoginDto} loginDto - DTO containing the login credentials.
   * @returns {Promise<string>} A promise that resolves to a signed JWT token.
   * @throws {UnauthorizedException} Throws when the credentials are invalid or the token cannot be generated.
   */
  public async login(loginDto: LoginDto): Promise<string> {
    const user = await this.getUserService
      .getByEmail(
        loginDto.email,
        'Invalid credentials',
        'Email ou senha inválidos',
      )
      .catch(() => {
        throw new UnauthorizedException(
          'Invalid credentials',
          'Email ou senha inválidos',
          null,
        );
      });

    const match = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!match) {
      throw new UnauthorizedException(
        'Invalid credentials',
        'Email ou senha inválidos',
        null,
      );
    }

    try {
      return await this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.jwtTtl,
        },
      );
    } catch (error) {
      throw new UnauthorizedException(
        error.message,
        'Nao foi possivel gerar o token de autenticação',
        null,
      );
    }
  }
}
