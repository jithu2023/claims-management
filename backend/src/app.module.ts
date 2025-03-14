import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ClaimsModule } from './claims/claims.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/Claims_management'), // Ensure a fallback value
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'default-secret-key', // Ensure a fallback secret
      signOptions: { expiresIn: '1h' },
    }),
    ClaimsModule,
    AuthModule,
  ],
})
export class AppModule {}
