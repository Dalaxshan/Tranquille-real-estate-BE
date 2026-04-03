import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString() userId?: string;
  @IsString() title?: string;
  @IsString() location?: string;
  @IsString() embedUrl?: string;
  @IsOptional() @IsString() virtualTourUrl?: string;
  @IsOptional() @IsNumber() bedrooms?: number;
  @IsNumber() price?: number;
  @IsNumber() pricePerch?: number;
  @IsEnum([
    'Colombo',
    'Galle',
    'Kurunegala',
    'Nugegoda',
    'Rajagiriya',
    'Wattala',
  ])
  city?: string;
  @IsEnum(['Sale', 'Rent', 'Sold']) landType?: string;
  @IsEnum([
    'Land',
    'Agricultural',
    'Residential',
    'Commercial',
    'Houses',
    'Apartment',
    'Villas',
  ])
  category?: string;
  @IsString() area?: string;
  @IsString() description?: string;
  @IsArray() images?: string[];
  @IsArray() features?: string[];
  @IsOptional() blueprint?: any;
  @IsOptional() agent?: any;
  @IsOptional() statistics?: any;
}
