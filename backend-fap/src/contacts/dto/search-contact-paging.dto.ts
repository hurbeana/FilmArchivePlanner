import { SearchContactDto } from './search-contact.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SearchContactPagingDto extends SearchContactDto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsString()
  searchString: string;
}
