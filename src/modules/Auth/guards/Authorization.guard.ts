import { CanActivate, ExecutionContext, Injectable,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ForbiddenException } from '../../../common/errors/Forbidden.exception';
import { UnauthorizedException } from '../../../common/errors/Unauthorized.exception';
import { PositionsEnum } from '../../User/enums/Positions.enum';
import { RolesEnum } from '../../User/enums/Roles.enum';
import { AUTHORIZATION_POSITIONS_KEY, AUTHORIZATION_ROLES_KEY} from '../decorators/Authorization.decorator';
import { UserData } from '../types/UserData.type';

type AuthorizedRequest = Request & {
  user?: UserData;
};

/**
 * Guard responsible for validating route authorization rules.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  /**
   * AuthorizationGuard constructor.
   *
   * @param {Reflector} reflector - Nest reflector used to read route metadata.
   */
  public constructor(protected readonly reflector: Reflector) {}

  /**
   * Validates whether the authenticated user can access the route.
   *
   * @param {ExecutionContext} context - The Nest execution context.
   * @returns {boolean} True when the user matches the route authorization rules.
   *
   * @throws {UnauthorizedException} Throws when there is no authenticated user in the request.
   * @throws {ForbiddenException} Throws when the authenticated user does not match the route rules.
   */
  public canActivate(context: ExecutionContext): boolean {
    const roles = this.getRequiredRoles(context);
    const positions = this.getRequiredPositions(context);

    if (roles.length === 0 && positions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthorizedRequest>();

    if (!request.user) {
      throw new UnauthorizedException(
        'Missing authenticated user',
        'Usuário autenticado não encontrado',
        null,
      );
    }

    if (!this.userMatchesRules(request.user, roles, positions)) {
      throw new ForbiddenException(
        'Forbidden action',
        'Ação proíbida',
        null,
      );
    }

    return true;
  }

  /**
   * Gets the roles required by the current route.
   *
   * @param {ExecutionContext} context - The Nest execution context.
   * @returns {RolesEnum[]} The required roles.
   */
  protected getRequiredRoles(context: ExecutionContext): RolesEnum[] {
    return (
      this.reflector.getAllAndOverride<RolesEnum[]>(AUTHORIZATION_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? []
    );
  }

  /**
   * Gets the positions required by the current route.
   *
   * @param {ExecutionContext} context - The Nest execution context.
   * @returns {PositionsEnum[]} The required positions.
   */
  protected getRequiredPositions(context: ExecutionContext): PositionsEnum[] {
    return (
      this.reflector.getAllAndOverride<PositionsEnum[]>(
        AUTHORIZATION_POSITIONS_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? []
    );
  }

  /**
   * Checks whether the user matches the route authorization rules.
   *
   * @param {UserData} user - The authenticated user.
   * @param {RolesEnum[]} roles - Required roles.
   * @param {PositionsEnum[]} positions - Required positions.
   * @returns {boolean} True when the user matches all configured rule groups.
   */
  protected userMatchesRules(
    user: UserData,
    roles: RolesEnum[],
    positions: PositionsEnum[],
  ): boolean {
    const roleMatches = roles.length === 0 || roles.includes(user.role);
    const positionMatches =
      positions.length === 0 || positions.includes(user.position);

    return roleMatches && positionMatches;
  }
}
