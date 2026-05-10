import type { Request } from 'express';
import { UserData } from '../../modules/Auth/types/UserData.type';

export type AuthenticatedRequest = Request & {
  user: UserData;
};
