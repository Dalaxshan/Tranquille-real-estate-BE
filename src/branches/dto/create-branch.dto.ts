import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBranchDto {
  @IsString() city: string;
  @IsString() name: string;
  @IsString() address: string;
  @IsString() phone: string;
  @IsString() email: string;
  @IsString() manager: string;
  @IsString() timings: string;
  @IsString() mapLink: string;
  @IsString() image: string;
  @IsOptional() @IsBoolean() isHeadOffice?: boolean;
}
