import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Local development
      'https://claim-frontend-15p9ndxtl-jithus-projects.vercel.app' // Deployed frontend
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  const jwtSecret = configService.get<string>('JWT_SECRET_KEY');
  if (!jwtSecret) {
    console.warn('⚠️ Warning: JWT_SECRET_KEY is not set! Using fallback secret.');
  }
  console.log('🔍 DEBUG - JWT_SECRET_KEY:', jwtSecret || 'Using default secret');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();

