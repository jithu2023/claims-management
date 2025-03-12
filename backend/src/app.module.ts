import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ClaimsModule } from './claims/claims.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env file
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    
    // ✅ Configure Multer for File Uploads
    MulterModule.register({
      dest: path.join(__dirname, '..', 'uploads'), // Save uploaded files to 'uploads' folder
    }),

    ClaimsModule,
  ],
})
export class AppModule {}