import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateClaimDto {
  @IsString()
  status: string;

  @IsNumber()
  @IsOptional()
  approvedAmount?: number;

  @IsString()
  @IsOptional()
  insurerComments?: string;
}