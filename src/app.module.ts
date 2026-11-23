import { Module } from '@nestjs/common';
import { EquipmentModule } from './equipment/equipment.module';
import { LoanRequestsModule } from './loan-requests/loan-requests.module';

@Module({
  imports: [EquipmentModule, LoanRequestsModule],
})
export class AppModule {}
