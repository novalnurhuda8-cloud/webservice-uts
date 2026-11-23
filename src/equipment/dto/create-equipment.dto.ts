import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  ASSET_CODE_MESSAGE,
  ASSET_CODE_REGEX,
} from '../../common/constants/asset-code.constant';
import { EquipmentCategory } from '../enums/equipment-category.enum';
import { EquipmentCondition } from '../enums/equipment-condition.enum';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(ASSET_CODE_REGEX, { message: ASSET_CODE_MESSAGE })
  assetCode!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  name!: string;

  @IsEnum(EquipmentCategory, {
    message: `category harus salah satu dari: ${Object.values(EquipmentCategory).join(', ')}`,
  })
  category!: EquipmentCategory;

  @IsEnum(EquipmentCondition, {
    message: `condition harus salah satu dari: ${Object.values(EquipmentCondition).join(', ')}`,
  })
  condition!: EquipmentCondition;

  @IsInt({ message: 'stock harus berupa bilangan bulat' })
  @Min(0)
  @Max(50)
  stock!: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  location!: string;
}
