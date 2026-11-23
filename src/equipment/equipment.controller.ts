import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { FindEquipmentQueryDto } from './dto/find-equipment-query.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Controller('equipment')
export class EquipmentController {
  @Get()
  findAll(@Query() query: FindEquipmentQueryDto) {
    return {
      message: 'Daftar alat (contoh response, data tidak disimpan)',
      filters: {
        category: query.category ?? null,
        keyword: query.keyword ?? null,
      },
      meta: { page: query.page, limit: query.limit },
      data: [],
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Detail alat (contoh response)',
      data: { id },
    };
  }

  @Post()
  create(@Body() dto: CreateEquipmentDto) {
    return {
      message: 'Equipment diterima (echo, tidak disimpan)',
      data: { id: 1, ...dto },
    };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipmentDto,
  ) {
    return {
      message: 'Perubahan equipment diterima (echo, tidak disimpan)',
      data: { id, ...dto },
    };
  }
}
