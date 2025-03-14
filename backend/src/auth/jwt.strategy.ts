// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET_KEY') || 'default-secret-key', // ✅ Provide a fallback
    });
  }

  async validate(payload: any) {
    console.log('✅ Token Decoded:', payload);
    return { userId: payload.userId, role: payload.role }; // Ensure userId remains userId
  }
  
}
