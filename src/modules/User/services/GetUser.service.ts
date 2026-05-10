import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { NotFoundException } from '../../../common/errors/NotFound.exception';

/**
 * Service responsible for retrieving users for authentication-related flows.
 */
@Injectable()
export class GetUserService {
  /**
   * GetUserService constructor.
   *
   * @param {Repository<User>} userRepository - Repository used to query users.
   */
  public constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  /**
   * Retrieves a user by email.
   *
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to the matching user.
   * @throws {NotFoundException} Throws when the user cannot be found.
   */
  public async getByEmail(
    email: string,
    message = 'User not found',
    userMessage = 'Usuario nao encontrado',
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(message, userMessage, { email });
    }

    return user;
  }

  /**
   * Retrieves a user by id.
   *
   * @param {number} id - The id of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to the matching user.
   * @throws {NotFoundException} Throws when the user cannot be found.
   */
  public async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found', 'Usuario nao encontrado', {
        id,
      });
    }

    return user;
  }
}
