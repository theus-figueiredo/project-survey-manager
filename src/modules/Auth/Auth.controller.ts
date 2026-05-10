import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiLoginDocs } from './docs/LoginDocs';
import { ApiRegisterDocs } from './docs/RegisterDocs';
import { LoginDto } from './dto/Login.dto';
import { LoginService } from './service/Login.service';
import { RegisterDto } from './dto/Register.dto';
import { RegisterService } from './service/Register.service';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { LoginResponse } from './responses/Login.response';
import { RegisterResponse } from './responses/Register.response';
import { Authorize } from './decorators/Authorization.decorator';
import { RolesEnum } from '../User/enums/Roles.enum';
import { PositionsEnum } from '../User/enums/Positions.enum';

/**
 * Controller responsible for authentication-related endpoints.
 */
@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  /**
   * AuthController constructor.
   *
   * @param {LoginService} loginService - Service used to authenticate users and issue tokens.
   * @param {RegisterService} registerService - Service used to register new users.
   */
  public constructor(
    protected readonly loginService: LoginService,
    protected readonly registerService: RegisterService,
  ) {}

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param {LoginDto} body - DTO containing the login credentials.
   * @returns {Promise<ApiResponse<{ token: string }>>} A promise that resolves to the signed JWT token response.
   */
  @ApiLoginDocs()
  @Post('login')
  public async login(@Body() body: LoginDto): Promise<ApiResponse<LoginResponse>> {
    const token = await this.loginService.login(body);

    return ApiResponse.success({ token });
  }

  /**
   * Registers a new user.
   *
   * @param {RegisterDto} body - DTO containing the registration payload.
   * @returns {Promise<ApiResponse<RegisteredUserResponse>>} A promise that resolves to the newly created user response.
   */
  @ApiRegisterDocs()
  @Post('register')
  @Authorize({
      roles: [RolesEnum.ADMIN],
      positions: [PositionsEnum.CONSULTANT]
  })
  public async register(@Body() body: RegisterDto): Promise<ApiResponse<RegisterResponse>> {
    const user = await this.registerService.register(body);

    return ApiResponse.success(user, 'usuario criado com sucesso');
  }
}
