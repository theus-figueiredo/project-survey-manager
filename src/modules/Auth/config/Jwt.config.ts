import { registerAs } from '@nestjs/config';

/**
 * Defines the JWT configuration for the authentication module.
 */
export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    jwtTtl: 604800,
  };
});
