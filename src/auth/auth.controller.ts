import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Role } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthDto, LoginResponseDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async register(@Body() body: RegisterDto) {
    const user = await this.userService.createUser(body.email, body.password);
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно авторизован',
    type: LoginResponseDto,
  })
  async login(@Body() body: AuthDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @Post('refresh')
  @ApiResponse({
    status: 200,
    description: 'Токен успешно обновлен',
    type: LoginResponseDto,
  })
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refresh_token);
  }
}
