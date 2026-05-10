/**
 * Abstract class that defines password hashing operations.
 */
export abstract class HashingService {
  /**
   * Hashes a plain text password.
   *
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} A promise that resolves to the hashed password.
   */
  public abstract hash(password: string): Promise<string>;

  /**
   * Compares a plain text password with a previously hashed password.
   *
   * @param {string} password - The plain text password received from the user.
   * @param {string} hashedPassword - The stored hashed password.
   * @returns {Promise<boolean>} A promise that resolves to true when the passwords match.
   */
  public abstract compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
