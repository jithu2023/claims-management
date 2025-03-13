import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../model/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signup(email: string, password: string, role: string, insurerId?: string) {
    if (!email || !password || !role) {
      throw new BadRequestException('Email, password, and role are required.');
    }

    // Trim input to avoid spaces causing issues
    email = email.trim();
    role = role.trim().charAt(0).toUpperCase() + role.trim().slice(1).toLowerCase();

    // Validate role
    if (!['User', 'Insurer'].includes(role)) {
      throw new BadRequestException('Invalid role. Allowed values: "User" or "Insurer".');
    }

    if (role === 'Insurer' && !insurerId) {
      throw new BadRequestException('Insurer ID is required for the Insurer role.');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
      insurerId: role === 'Insurer' ? insurerId : undefined,
    });

    await newUser.save();
    return { message: 'Signup successful' };
  }

  async login(email: string, password: string, insurerId?: string) {
    email = email.trim();

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role === 'Insurer' && (!insurerId || user.insurerId !== insurerId)) {
      throw new UnauthorizedException('Invalid Insurer ID.');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = this.jwtService.sign(
      { userId: user._id, role: user.role },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: '1h', // ✅ Token expires in 1 hour for security
      }
    );

    return { token };
  }
}
