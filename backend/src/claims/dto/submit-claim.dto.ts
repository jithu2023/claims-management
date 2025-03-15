import { IsEmail, IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class SubmitClaimDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(0)
  claimAmount: number;

  @IsUrl()
  fileUrl: string;

  @IsString()
  description?: string; // Optional field
}