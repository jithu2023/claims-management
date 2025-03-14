import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimDocument } from './claims.schema';

@Injectable()
export class ClaimsService {
  constructor(@InjectModel(Claim.name) private claimModel: Model<ClaimDocument>) {}

  async submitClaim(claimData: Partial<Claim>): Promise<Claim> {
    if (!claimData.email) {
      throw new NotFoundException('Email is required.');
    }

    const existingClaim = await this.findClaimByEmail(claimData.email);
    if (existingClaim) {
      throw new ConflictException('A claim with this email already exists.');
    }

    const newClaim = new this.claimModel({
      ...claimData,
      status: 'Pending',
      submissionDate: new Date(),
    });

    return newClaim.save();
  }

  async getAllClaims(): Promise<Claim[]> {
    return this.claimModel.find().exec();
  }

  async getClaimsByUserId(userId: string): Promise<Claim[]> {
    return this.claimModel.find({ userId }).exec();
  }

  async updateClaim(id: string, updateData: { status: string; approvedAmount?: number; insurerComments?: string }): Promise<Claim> {
    const updatedClaim = await this.claimModel.findByIdAndUpdate(id, updateData, { new: true }).exec();

    if (!updatedClaim) {
      throw new NotFoundException(`Claim with ID ${id} not found.`);
    }

    return updatedClaim;
  }

  async findClaimByEmail(email: string): Promise<Claim | null> {
    return this.claimModel.findOne({ email }).exec();
  }
}
