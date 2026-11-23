import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateLoanRequestDto } from './create-loan-request.dto';

export class UpdateLoanRequestDto extends PartialType(
  PickType(CreateLoanRequestDto, ['returnDate', 'purpose'] as const),
) {}
