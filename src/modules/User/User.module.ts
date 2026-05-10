import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { GetUserService } from './services/GetUser.service';

/**
 * Module responsible for user entity registration and user-related providers.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [GetUserService],
  exports: [TypeOrmModule, GetUserService],
})
export class UserModule {}
