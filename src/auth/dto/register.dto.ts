import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String, example: 'iUd6V@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'password' })
  @IsString()
  password: string;
}
