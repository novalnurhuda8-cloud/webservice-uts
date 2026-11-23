import {
  IsEmail,
  IsInt,
  IsISO8601,
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

export class CreateLoanRequestDto {
  @IsString()
  @Matches(/^[0-9]{8,12}$/, {
    message: 'borrowerNim harus berupa digit saja dengan panjang 8-12 karakter',
  })
  borrowerNim!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 70)
  borrowerName!: string;

  @IsEmail({}, { message: 'borrowerEmail harus berformat email yang valid' })
  borrowerEmail!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(ASSET_CODE_REGEX, { message: ASSET_CODE_MESSAGE })
  assetCode!: string;

  @IsInt({ message: 'quantity harus berupa bilangan bulat' })
  @Min(1)
  @Max(3)
  quantity!: number;

  @IsISO8601(
    { strict: true },
    { message: 'startDate harus berformat tanggal ISO 8601 (contoh: 2026-11-25)' },
  )
  startDate!: string;

  @IsISO8601(
    { strict: true },
    { message: 'returnDate harus berformat tanggal ISO 8601 (contoh: 2026-11-28)' },
  )
  returnDate!: string;

  @IsString()
  @IsNotEmpty()
  @Length(15, 250)
  purpose!: string;
}
