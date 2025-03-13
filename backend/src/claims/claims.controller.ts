// src/claims/claims.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
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
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async submitClaim(
    @UploadedFile() file: Express.Multer.File,
    @Body() claimData: any,
  ): Promise<Claim> {
    console.log('Received claim data:', claimData);
    console.log('Uploaded file:', file);

    claimData.claimAmount = Number(claimData.claimAmount);

    if (file) {
      claimData.documentUrl = `http://localhost:3000/uploads/${file.filename}`;
    }

    return this.claimsService.submitClaim(claimData);
  }

  @Get()
  @Roles(Role.Insurer)
  async getAllClaims(): Promise<Claim[]> {
    return this.claimsService.getAllClaims();
  }

  @Patch(':id')
  @Roles(Role.Insurer)
  async updateClaim(
    @Param('id') id: string,
    @Body()
    updateData: {
      status: string;
      approvedAmount?: number;
      insurerComments?: string;
    },
  ): Promise<Claim> {
    const updatedClaim = await this.claimsService.updateClaim(id, updateData);
    if (!updatedClaim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    return updatedClaim;
  }
}
