import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimDocument } from './claims.schema';

@Injectable()
export class ClaimsService {
  constructor(@InjectModel(Claim.name) private claimModel: Model<ClaimDocument>) {}

  async submitClaim(claimData: Partial<Claim>): Promise<Claim> {
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

  async getClaimById(id: string): Promise<Claim> {
    const claim = await this.claimModel.findById(id).exec();
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found.`);
    }
    return claim;
  }

  async updateClaim(
    id: string,
    updateData: { status?: string; approvedAmount?: number; insurerComment?: string; insurerComments?: string }
  ): Promise<Claim> {
    console.log('Received update data:', updateData); // Debugging log

    // Ensure we update the correct field (insurerComments)
    if (updateData.insurerComment) {
      updateData.insurerComments = updateData.insurerComment;
      delete updateData.insurerComment;
    }

    const updatedClaim = await this.claimModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, strict: false } // strict: false allows updating non-schema fields
    ).exec();

    if (!updatedClaim) {
      throw new NotFoundException(`Claim with ID ${id} not found.`);
    }

    console.log('Updated claim:', updatedClaim); // Log the updated claim

    return updatedClaim;
  }
}
