import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GetUserService } from '../../User/services/GetUser.service';
import { UserData } from '../types/UserData.type';
import { UnauthorizedException } from '../../../common/errors/Unauthorized.exception';

/**
 * Guard responsible for validating Bearer tokens and attaching the authenticated user to the request.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * AuthGuard constructor.
   *
   * @param {JwtService} jwtService - Service used to verify JWT tokens.
   * @param {GetUserService} getUserService - Service used to retrieve the authenticated user.
   */
  public constructor(
    protected readonly jwtService: JwtService,
    protected readonly getUserService: GetUserService,
  ) {}

  /**
   * Validates the incoming request authentication token.
   *
   * @param {ExecutionContext} context - The Nest execution context.
   * @returns {Promise<boolean>} A promise that resolves to true when the request is authenticated.
   * @throws {UnauthorizedException} Throws when the token is missing, invalid, or the user cannot be resolved.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { user?: UserData } = context
      .switchToHttp()
      .getRequest();

    const token = this.extractTokenFromHeader(request);
    const decoded = await this.verifyToken(token);
    const user = await this.getUserService.getById(decoded.id);

    request.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      position: user.position,
    };

    return true;
  }

  /**
   * Extracts the Bearer token from the Authorization header.
   *
   * @param {Request} request - The current HTTP request.
   * @returns {string} The extracted JWT token.
   * @throws {UnauthorizedException} Throws when the Authorization header is missing or malformed.
   */
  private extractTokenFromHeader(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing Bearer token',
        'Token de autenticação não informado',
        null,
      );
    }

    return authHeader.split(' ')[1];
  }

  /**
   * Verifies the JWT token and returns its payload.
   *
   * @param {string} token - The JWT token to verify.
   * @returns {Promise<{ id: number }>} A promise that resolves to the decoded payload.
   * @throws {UnauthorizedException} Throws when the token is invalid.
   */
  private async verifyToken(token: string): Promise<{ id: number }> {
    try {
      return await this.jwtService.verifyAsync<{ id: number }>(token);
    } catch {
      throw new UnauthorizedException(
        'Unauthorized',
        'Token de autenticação inválido',
        null,
      );
    }
  }
}
