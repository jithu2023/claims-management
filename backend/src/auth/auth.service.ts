import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../model/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signup(email: string, password: string, role: string, insurerId?: string): Promise<{ token: string }> {
    email = email.trim(); // Ensure consistent formatting

    // 🔍 Debugging: Check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      console.error('Signup failed: Email already exists', email);
      throw new ConflictException('User with this email already exists.');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
      insurerId: role === 'Insurer' ? insurerId : undefined, // Only store insurerId for Insurers
    });

    await newUser.save();
    console.log('User signed up successfully:', { email, role });

    // Generate JWT token
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY') || 'defaultSecretKey';
    const token = this.jwtService.sign(
      { userId: newUser._id, role: newUser.role }, // userId and role are included in the JWT
      { secret: secretKey, expiresIn: '1h' } // Expires in 1 hour
    );

    return { token };
  }

  async login(email: string, password: string, insurerId?: string): Promise<{ token: string }> {
    email = email.trim();

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      console.error('Login failed: User not found', email);
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Ensure Insurer has valid Insurer ID
    if (user.role === 'Insurer' && (!insurerId || user.insurerId !== insurerId)) {
      console.error('Login failed: Invalid Insurer ID', { email, expected: user.insurerId, received: insurerId });
      throw new UnauthorizedException('Invalid Insurer ID.');
    }

    // Compare the provided password with the stored hashed password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      console.error('Login failed: Incorrect password for', email);
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate JWT token
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY') || 'defaultSecretKey';
    const token = this.jwtService.sign(
      { userId: user._id, role: user.role }, // userId and role are included in the JWT
      { secret: secretKey, expiresIn: '1h' }  // Expires in 1 hour
    );

    console.log('Login successful:', { email, role: user.role, userId: user._id });  // Added userId in log

    return { token };
  }
}
