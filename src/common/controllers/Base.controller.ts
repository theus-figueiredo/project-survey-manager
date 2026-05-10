import { UserData } from '../../modules/Auth/types/UserData.type';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.type';

/**
 * Base controller with shared helpers for HTTP controllers.
 */
export abstract class BaseController {
  /**
   * Gets the authenticated user attached to the request.
   *
   * @param {AuthenticatedRequest} request - The authenticated HTTP request.
   * @returns {UserData} The authenticated user.
   */
  protected getAuthenticatedUser(request: AuthenticatedRequest): UserData {
    return request.user;
  }
}
