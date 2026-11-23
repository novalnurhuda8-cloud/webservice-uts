import { Module } from '@nestjs/common';
import { LoanRequestsController } from './loan-requests.controller';

@Module({
  controllers: [LoanRequestsController],
})
export class LoanRequestsModule {}
