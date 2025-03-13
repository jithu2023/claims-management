import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(cors()); // Enable CORS

  // Serve static files from the "uploads" directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // ✅ Debug: Check if JWT_SECRET_KEY is being loaded
  console.log('🔍 DEBUG - JWT_SECRET_KEY:', configService.get<string>('JWT_SECRET_KEY'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
