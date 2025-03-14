import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClaimsService } from './claims.service';
import { Claim } from './claims.schema';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  async findAll(): Promise<Claim[]> {
    return this.claimsService.getAllClaims();
  }

  @Get('user/:id')
  async getUserClaimsById(@Param('id') id: string): Promise<Claim[]> {
    if (!id) {
      throw new NotFoundException('User ID is required.');
    }
    return this.claimsService.getClaimsByUserId(id);
  }

  @Get('claim/:id')
  async getClaimById(@Param('id') id: string): Promise<Claim> {
    if (!id) {
      throw new NotFoundException('Claim ID is required.');
    }
    return this.claimsService.getClaimById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async submitClaim(
    @UploadedFile() file: Express.Multer.File,
    @Body() claimData: any
  ): Promise<Claim> {
    claimData.claimAmount = Number(claimData.claimAmount);

    if (isNaN(claimData.claimAmount) || claimData.claimAmount <= 0) {
      throw new BadRequestException('Invalid claim amount.');
    }

    if (!claimData.email) {
      throw new BadRequestException('Email is required.');
    }

    if (file) {
      claimData.documentUrl = `http://localhost:3000/uploads/${file.filename}`;
    }

    return await this.claimsService.submitClaim(claimData);
  }

  @Patch(':id') // ✅ No authentication required
  async updateClaim(
    @Param('id') id: string,
    @Body() updateData: { status: string; approvedAmount?: number; insurerComments?: string }
  ): Promise<Claim> {
    if (!id) {
      throw new NotFoundException('Claim ID is required.');
    }

    return this.claimsService.updateClaim(id, updateData);
  }
}
