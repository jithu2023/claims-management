import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import * as path from 'path';

import { ClaimsModule } from './claims/claims.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Ensure env variables are loaded
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MulterModule.register({
      dest: path.join(__dirname, '..', 'uploads'),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'), // ✅ Fixed key name
        signOptions: { expiresIn: '60m' },
      }),
    }),
    ClaimsModule,
    AuthModule,
  ],
  providers: [
    // ✅ Remove JwtAuthGuard from global scope to allow public signup/login
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard, // Only enforce role-based access where needed
    },
  ],
})
export class AppModule {}
