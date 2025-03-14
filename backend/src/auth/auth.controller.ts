import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string; role: string; insurerId?: string }) {
    return this.authService.signup(body.email, body.password, body.role, body.insurerId);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string; insurerId?: string }) {
    const result = await this.authService.login(body.email, body.password, body.insurerId);

    if (!result || !result.token) {
      throw new UnauthorizedException('Invalid credentials or missing token.');
    }

    return result;
  }
}
