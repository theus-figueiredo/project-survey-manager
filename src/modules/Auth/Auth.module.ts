import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/Jwt.config';
import { UserModule } from '../User/User.module';
import { AuthController } from './Auth.controller';
import { HashingService } from './abstract/Hashing.service';
import { BcryptHashingService } from './service/BcryptHashing.service';
import { LoginService } from './service/Login.service';
import { AuthGuard } from './guards/Auth.guard';
import { RegisterService } from './service/Register.service';
import { AuthorizationGuard } from './guards/Authorization.guard';

/**
 * Module responsible for authentication concerns such as login, JWT issuance, and request guards.
 */
@Module({
  imports: [
    UserModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
    LoginService,
    RegisterService,
    AuthGuard,
    AuthorizationGuard,
  ],
  exports: [HashingService, JwtModule, AuthGuard, AuthorizationGuard],
})
export class AuthModule {}
