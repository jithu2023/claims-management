import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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

  // ✅ NEW: Check if an email exists in claims
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string) {
    const existingClaim = await this.claimsService.findByEmail(email);
    return { exists: !!existingClaim };
  }

  @Post()
  async submitClaim(@Body() claimData: any): Promise<Claim> {
    claimData.claimAmount = Number(claimData.claimAmount);

    if (isNaN(claimData.claimAmount) || claimData.claimAmount <= 0) {
      throw new BadRequestException('Invalid claim amount.');
    }

    if (!claimData.email) {
      throw new BadRequestException('Email is required.');
    }

    if (!claimData.fileUrl || !/^https?:\/\//.test(claimData.fileUrl)) {
      console.error("Invalid file URL received:", claimData.fileUrl);
      throw new BadRequestException('Invalid file URL. Please upload a valid document.');
    }

    console.log("Claim submission received with document URL:", claimData.fileUrl);

    return await this.claimsService.submitClaim(claimData);
  }

  @Patch(':id')
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
