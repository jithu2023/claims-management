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
        callback(null, true);
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
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // 🚀 Preflight Request Handler
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    logger.log(`📡 Preflight request received from: ${origin}`);

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
    } else {
      logger.warn(`⛔ Preflight blocked for: ${origin}`);
    }

    next();
  });

  // 🔒 JWT Secret Check
  const jwtSecret = configService.get<string>('JWT_SECRET_KEY');
  if (!jwtSecret) {
    logger.warn('⚠️ Warning: JWT_SECRET_KEY is not set! Using fallback secret.');
  }

  // 🚀 Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on port ${port}`);
}

bootstrap();