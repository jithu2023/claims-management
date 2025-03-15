import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 🔥 Corrected CORS handling
  const allowedOrigins = ['http://localhost:5173', 'https://claim-frontend-two.vercel.app'];

  app.enableCors({
    origin: (origin, callback) => {
      logger.log(`🔍 CORS request from: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        logger.warn(`⛔ CORS blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // 🔥 Static Assets (Ensure correct path)
  const uploadsPath = join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });
  logger.log(`📂 Serving static files from: ${uploadsPath}`);

  // 🔒 JWT Secret Check
  const jwtSecret = configService.get<string>('JWT_SECRET_KEY');
  if (!jwtSecret) {
    logger.error('❌ Error: JWT_SECRET_KEY is not set!');
    process.exit(1); // Exit the application if JWT_SECRET_KEY is not set
  } else {
    logger.log(`🔑 JWT Secret Key loaded successfully`);
  }

  // 🚀 Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on port ${port}`);
}

bootstrap();