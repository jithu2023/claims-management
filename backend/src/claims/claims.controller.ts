import { 
  Controller, Get, Post, Patch, Param, Body, NotFoundException, 
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClaimsService } from './claims.service';
import { Claim } from './claims.schema';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Save files in "uploads" folder
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    })
  )
  async submitClaim(
    @UploadedFile() file: Express.Multer.File,
    @Body() claimData: any
  ): Promise<Claim> {
    console.log('Received claim data:', claimData);
    console.log('Uploaded file:', file);

    claimData.claimAmount = Number(claimData.amount);
    delete claimData.amount;

    if (file) {
      claimData.fileUrl = `http://localhost:3000/uploads/${file.filename}`; // Set full URL
    }

    return this.claimsService.submitClaim(claimData);
  }

  @Get()
  async getAllClaims(): Promise<Claim[]> {
    return this.claimsService.getAllClaims();
  }

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
