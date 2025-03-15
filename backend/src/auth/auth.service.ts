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
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sign up a new user.
   * @param email - The user's email.
   * @param password - The user's password.
   * @param role - The user's role (e.g., 'User' or 'Insurer').
   * @param insurerId - The insurer ID (required if the role is 'Insurer').
   * @returns {Promise<{ token: string }>} - A JWT token for the new user.
   */
  async signup(email: string, password: string, role: string, insurerId?: string): Promise<{ token: string }> {
    email = email.trim(); // Ensure consistent formatting

    // Check if the email already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      console.error('Signup failed: Email already exists', email);
      throw new ConflictException('User with this email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
      insurerId: role === 'Insurer' ? insurerId : undefined, // Only store insurerId for Insurers
    });

    await newUser.save();
    console.log('User signed up successfully:', { email, role });

    // Generate a JWT token
    const payload = { userId: newUser._id.toString(), role: newUser.role }; // Cast _id to string
    const token = this.generateToken(payload);

    return { token };
  }

  /**
   * Log in an existing user.
   * @param email - The user's email.
   * @param password - The user's password.
   * @param insurerId - The insurer ID (required if the role is 'Insurer').
   * @returns {Promise<{ token: string }>} - A JWT token for the logged-in user.
   */
  async login(email: string, password: string, insurerId?: string): Promise<{ token: string }> {
    email = email.trim();

    // Find the user by email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.error('Login failed: User not found', email);
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Ensure Insurer has a valid Insurer ID
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

    // Generate a JWT token
    const payload = { userId: user._id.toString(), role: user.role }; // Cast _id to string
    const token = this.generateToken(payload);

    console.log('Login successful:', { email, role: user.role, userId: user._id });

    return { token };
  }

  /**
   * Generate a JWT token.
   * @param payload - The payload to include in the token.
   * @returns {string} - The generated JWT token.
   */
  private generateToken(payload: { userId: string; role: string }): string {
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY') || 'defaultSecretKey';
    return this.jwtService.sign(payload, { secret: secretKey, expiresIn: '1h' });
  }
}