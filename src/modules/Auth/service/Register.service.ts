import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from '../abstract/Hashing.service';
import { RegisterDto } from '../dto/Register.dto';
import { User } from '../../User/entities/User.entity';
import { PositionsEnum } from '../../User/enums/Positions.enum';
import { RolesEnum } from '../../User/enums/Roles.enum';
import { ConflictException } from '../../../common/errors/Conflict.exception';

/**
 * Type representing the public data returned after a successful user registration.
 */
type RegisteredUser = {
  id: number;
  email: string;
  name: string;
  role: RolesEnum;
  position: PositionsEnum;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Service responsible for registering new users in the application.
 */
@Injectable()
export class RegisterService {
  /**
   * RegisterService constructor.
   *
   * @param {Repository<User>} userRepository - Repository used to persist users.
   * @param {HashingService} hashingService - Service used to hash passwords before saving them.
   */
  public constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
    protected readonly hashingService: HashingService,
  ) {}

  /**
   * Creates a new user after validating email uniqueness and hashing the password.
   *
   * @param {RegisterDto} registerDto - DTO containing the user registration payload.
   * @returns {Promise<RegisteredUser>} A promise that resolves to the created user without the password field.
   * @throws {ConflictException} Throws when the email is already registered.
   */
  public async register(registerDto: RegisterDto): Promise<RegisteredUser> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
      withDeleted: false,
    });

    if (existingUser) {
      throw new ConflictException(
        'Email already registered',
        'Este email ja esta em uso',
        { email: registerDto.email },
      );
    }

    const user = this.userRepository.create({
      ...registerDto,
      password: await this.hashingService.hash(registerDto.password),
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      position: savedUser.position,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
}
