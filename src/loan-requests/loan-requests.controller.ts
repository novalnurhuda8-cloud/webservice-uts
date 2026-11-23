import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
import { LoanStatus } from './enums/loan-status.enum';

@Controller('loan-requests')
export class LoanRequestsController {
  @Post()
  create(@Body() dto: CreateLoanRequestDto) {
    return {
      message: 'Pengajuan peminjaman diterima (echo, tidak disimpan)',
      data: {
        id: 1,
        ...dto,
        status: LoanStatus.PENDING,
        createdAt: new Date().toISOString(),
      },
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Detail pengajuan peminjaman (contoh response)',
      data: { id },
    };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLoanRequestDto,
  ) {
    return {
      message: 'Perubahan pengajuan diterima (echo, tidak disimpan)',
      data: { id, ...dto },
    };
  }
}
