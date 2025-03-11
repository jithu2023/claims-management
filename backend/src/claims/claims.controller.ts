import { Controller, Get, Post, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { Claim } from './claims.schema';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  // ✅ Endpoint to Submit a Claim
  @Post()
  async submitClaim(@Body() claimData: Partial<Claim>): Promise<Claim> {
    return this.claimsService.submitClaim(claimData);
  }

  // ✅ Endpoint to Get All Claims
  @Get()
  async getAllClaims(): Promise<Claim[]> {
    return this.claimsService.getAllClaims();
  }

  // ✅ Endpoint to Update a Claim
  @Patch(':id')
  async updateClaim(
    @Param('id') id: string,
    @Body() updateData: { status: string; approvedAmount?: number; insurerComments?: string }
  ): Promise<Claim> {
    const updatedClaim = await this.claimsService.updateClaim(id, updateData);
    if (!updatedClaim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    return updatedClaim;
  }
}
