import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    AdminModule.forRootAsync(),
  ],
  providers: [AuthService, UserService, PrismaService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
