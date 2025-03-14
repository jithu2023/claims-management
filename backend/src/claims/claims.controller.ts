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
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClaimsService } from './claims.service';
import { Claim } from './claims.schema';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get('user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserClaimsById(@Param('id') id: string, @Req() req): Promise<Claim[]> {
    if (!id) {
      throw new NotFoundException('User ID is required.');
    }

    if (req.user.role !== Role.Insurer && req.user.id !== id) {
      throw new NotFoundException('You are not authorized to view these claims.');
    }

    return this.claimsService.getClaimsByUserId(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Insurer)
  async getAllClaims(): Promise<Claim[]> {
    return this.claimsService.getAllClaims();
  }

  @Get('check-email/:email')
  @UseGuards(JwtAuthGuard)
  async checkEmailExists(@Param('email') email: string): Promise<{ exists: boolean }> {
    if (!email) {
      throw new BadRequestException('Email is required.');
    }

    const existingClaim = await this.claimsService.findClaimByEmail(email);
    return { exists: !!existingClaim };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
    @Body() claimData: any,
    @Req() req,
  ): Promise<Claim> {
    claimData.userId = req.user.id;
    claimData.claimAmount = Number(claimData.claimAmount);

    if (isNaN(claimData.claimAmount) || claimData.claimAmount <= 0) {
      throw new BadRequestException('Invalid claim amount.');
    }

    if (!claimData.email) {
      throw new BadRequestException('Email is required.');
    }

    const existingClaim = await this.claimsService.findClaimByEmail(claimData.email);
    if (existingClaim) {
      throw new ConflictException('A claim with this email already exists.');
    }

    if (file) {
      claimData.documentUrl = `http://localhost:3000/uploads/${file.filename}`;
    }

    return await this.claimsService.submitClaim(claimData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Insurer)
  async updateClaim(
    @Param('id') id: string,
    @Body() updateData: { status: string; approvedAmount?: number; insurerComments?: string },
  ): Promise<Claim> {
    if (!id) {
      throw new NotFoundException('Claim ID is required.');
    }

    return this.claimsService.updateClaim(id, updateData);
  }
}
