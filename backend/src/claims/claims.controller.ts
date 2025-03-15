import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { Claim } from './claims.schema';
import { SubmitClaimDto } from './dto/submit-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  /**
   * Fetch all claims.
   * @returns {Promise<Claim[]>} - List of all claims.
   */
  @Get()
  async findAll(): Promise<Claim[]> {
    return this.claimsService.getAllClaims();
  }

  /**
   * Fetch all claims for a specific user by their ID.
   * @param {string} id - The user's ID.
   * @returns {Promise<Claim[]>} - List of claims for the user.
   */
  @Get('user/:id')
  async getUserClaimsById(@Param('id') id: string): Promise<Claim[]> {
    if (!id) {
      throw new NotFoundException('User ID is required.');
    }
    return this.claimsService.getClaimsByUserId(id);
  }

  /**
   * Fetch a specific claim by its ID.
   * @param {string} id - The claim's ID.
   * @returns {Promise<Claim>} - The claim details.
   */
  @Get('claim/:id')
  async getClaimById(@Param('id') id: string): Promise<Claim> {
    if (!id) {
      throw new NotFoundException('Claim ID is required.');
    }
    return this.claimsService.getClaimById(id);
  }

  /**
   * Check if a claim exists for a given email.
   * @param {string} email - The email to check.
   * @returns {Promise<{ exists: boolean }>} - Whether a claim exists for the email.
   */
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string): Promise<{ exists: boolean }> {
    const existingClaim = await this.claimsService.findByEmail(email);
    return { exists: !!existingClaim };
  }

  /**
   * Submit a new claim.
   * @param {SubmitClaimDto} claimData - The claim data.
   * @returns {Promise<Claim>} - The created claim.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitClaim(@Body() claimData: SubmitClaimDto): Promise<Claim> {
    claimData.claimAmount = Number(claimData.claimAmount);

    // Validate claim amount
    if (isNaN(claimData.claimAmount) || claimData.claimAmount <= 0) {
      throw new BadRequestException('Invalid claim amount.');
    }

    // Validate email
    if (!claimData.email) {
      throw new BadRequestException('Email is required.');
    }

    // Validate file URL
    if (!claimData.fileUrl || !/^https?:\/\//.test(claimData.fileUrl)) {
      console.error('Invalid file URL received:', claimData.fileUrl);
      throw new BadRequestException('Invalid file URL. Please upload a valid document.');
    }

    console.log('Claim submission received with document URL:', claimData.fileUrl);

    return await this.claimsService.submitClaim(claimData);
  }

  /**
   * Update a specific claim by its ID.
   * @param {string} id - The claim's ID.
   * @param {UpdateClaimDto} updateData - The update data.
   * @returns {Promise<Claim>} - The updated claim.
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateClaim(
    @Param('id') id: string,
    @Body() updateData: UpdateClaimDto,
  ): Promise<Claim> {
    if (!id) {
      throw new NotFoundException('Claim ID is required.');
    }

    return this.claimsService.updateClaim(id, updateData);
  }
}