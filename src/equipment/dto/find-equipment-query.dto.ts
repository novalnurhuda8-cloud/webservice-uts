import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { EquipmentCategory } from '../enums/equipment-category.enum';

export class FindEquipmentQueryDto {
  @IsOptional()
  @IsEnum(EquipmentCategory, {
    message: `category harus salah satu dari: ${Object.values(EquipmentCategory).join(', ')}`,
  })
  category?: EquipmentCategory;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page harus berupa bilangan bulat' })
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit harus berupa bilangan bulat' })
  @Min(1)
  @Max(20)
  limit: number = 10;
}
