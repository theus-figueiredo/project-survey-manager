import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PositionsEnum } from '../../User/enums/Positions.enum';
import { RolesEnum } from '../../User/enums/Roles.enum';

export const AUTHORIZATION_ROLES_KEY = 'authorization_roles';
export const AUTHORIZATION_POSITIONS_KEY = 'authorization_positions';

type AuthorizationOptions = {
  roles?: RolesEnum[];
  positions?: PositionsEnum[];
};

/**
 * Defines the roles required to access a route.
 *
 * @param {RolesEnum[]} roles - Allowed user roles.
 * @returns {MethodDecorator & ClassDecorator} Metadata decorator.
 */
export function Roles(...roles: RolesEnum[]): MethodDecorator & ClassDecorator {
  return SetMetadata(AUTHORIZATION_ROLES_KEY, roles);
}

/**
 * Defines the positions required to access a route.
 *
 * @param {PositionsEnum[]} positions - Allowed user positions.
 * @returns {MethodDecorator & ClassDecorator} Metadata decorator.
 */
export function Positions(
  ...positions: PositionsEnum[]
): MethodDecorator & ClassDecorator {
  return SetMetadata(AUTHORIZATION_POSITIONS_KEY, positions);
}

/**
 * Defines role and position requirements to access a route.
 *
 * @param {AuthorizationOptions} options - Authorization rules for the route.
 * @returns {MethodDecorator & ClassDecorator} Metadata decorator.
 */
export function Authorize(
  options: AuthorizationOptions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    SetMetadata(AUTHORIZATION_ROLES_KEY, options.roles ?? []),
    SetMetadata(AUTHORIZATION_POSITIONS_KEY, options.positions ?? []),
  );
}
