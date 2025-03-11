import { Injectable } from '@nestjs/common';

@Injectable()
export class ClaimsService {
  getAllClaims() {
    return [{ id: 1, name: "Claim A" }, { id: 2, name: "Claim B" }];
  }
}
