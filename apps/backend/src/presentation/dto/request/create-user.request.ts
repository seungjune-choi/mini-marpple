import { User } from '@backend/core';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  toEntity(): User {
    return User.new({
      email: this.email,
      password: this.password,
    });
  }
}
