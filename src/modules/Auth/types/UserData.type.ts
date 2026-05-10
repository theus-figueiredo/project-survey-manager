import { RolesEnum } from '../../User/enums/Roles.enum';
import { PositionsEnum } from '../../User/enums/Positions.enum';

/**
 * Type that describes the authenticated user data attached to requests.
 */
export type UserData = {
  id: number;
  email: string;
  name: string;
  role: RolesEnum;
  position: PositionsEnum;
};
