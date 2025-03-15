import { Controller, Post, Body, ConflictException, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../model/user.schema'; // Import the User schema

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() body: { email: string; password: string; role: string; insurerId?: string }) {
    const { email, password, role, insurerId } = body;

    // Call the AuthService to handle signup
    const result = await this.authService.signup(email, password, role, insurerId);

    return { message: 'Signup successful', token: result.token };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() body: { email: string; password: string; insurerId?: string }) {
    const { email, password, insurerId } = body;

    // Call the AuthService to handle login
    const result = await this.authService.login(email, password, insurerId);

    return { message: 'Login successful', token: result.token };
  }
}