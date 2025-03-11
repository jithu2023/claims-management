import { Controller, Get } from '@nestjs/common';
import { ClaimsService } from './claims/claims.service';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  getAllClaims() {
    return this.claimsService.getAllClaims();
  }
}
