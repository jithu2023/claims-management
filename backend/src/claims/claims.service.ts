import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimDocument } from './claims.schema';

@Injectable()
export class ClaimsService {
  constructor(@InjectModel(Claim.name) private claimModel: Model<ClaimDocument>) {}

  // ✅ Method to Submit a New Claim
  async submitClaim(claimData: Partial<Claim>): Promise<Claim> {
    const newClaim = new this.claimModel({
      ...claimData,
      status: 'Pending', // Default status
      submissionDate: new Date(),
    });
    return newClaim.save();
  }

  // ✅ Method to Get All Claims
  async getAllClaims(): Promise<Claim[]> {
    return this.claimModel.find().exec();
  }

  // ✅ Method to Update Claim Status
  async updateClaim(id: string, updateData: { status: string; approvedAmount?: number; insurerComments?: string }) {
    const claim = await this.claimModel.findByIdAndUpdate(id, updateData, { new: true }).exec();

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    return claim;
  }
}
