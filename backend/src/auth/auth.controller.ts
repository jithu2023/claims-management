import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')  
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')  // ✅ No AuthGuard should be here
  async signup(@Body() body: { email: string; password: string; role: string; insurerId?: string }) {
    return this.authService.signup(body.email, body.password, body.role, body.insurerId);
  }

  @Post('login')  
  async login(@Body() body: { email: string; password: string; insurerId?: string }) {
    return this.authService.login(body.email, body.password, body.insurerId);
  }
}
