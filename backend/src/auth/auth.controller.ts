import { Controller, Post, Body, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../model/user.schema'; // Import the User schema
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectModel(User.name) private userModel: Model<User>, // Inject the User model
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() body: User) {
    // Check if the email already exists
    const existingUser = await this.userModel.findOne({ email: body.email }).exec();
    if (existingUser) {
      throw new UnauthorizedException('Email already exists.');
    }

    // Create a new user
    const newUser = new this.userModel(body);
    await newUser.save();

    return { message: 'Signup successful', user: newUser };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() body: { email: string; password: string; insurerId?: string }) {
    const result = await this.authService.login(body.email, body.password, body.insurerId);

    if (!result || !result.token) {
      throw new UnauthorizedException('Invalid credentials or missing token.');
    }

    return result;
  }
}