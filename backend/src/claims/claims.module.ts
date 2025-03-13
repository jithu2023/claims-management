import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { Claim, ClaimSchema } from './claims.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Claim.name, schema: ClaimSchema }]),
    AuthModule,
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService],
})
export class ClaimsModule {}
