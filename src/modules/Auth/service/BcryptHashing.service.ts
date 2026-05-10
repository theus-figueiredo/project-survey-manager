import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { HashingService } from '../abstract/Hashing.service';

/**
 * Service responsible for hashing and comparing passwords using bcrypt.
 */
@Injectable()
export class BcryptHashingService extends HashingService {
  private readonly saltRounds: number = 10;

  /**
   * Hashes a password with bcrypt.
   *
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} A promise that resolves to the hashed password.
   */
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compares a plain text password with its hashed representation.
   *
   * @param {string} password - The plain text password.
   * @param {string} hashedPassword - The stored hashed password.
   * @returns {Promise<boolean>} A promise that resolves to true if the passwords match.
   */
  public async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
