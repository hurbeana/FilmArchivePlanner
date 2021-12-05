import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TagType } from '../tagtype.enum';

export class TagReferenceDto {
  @AutoMap()
  @IsNumber()
  id: number;

  @AutoMap()
  @IsEnum(TagType)
  @IsOptional()
  type?: TagType;

  @AutoMap()
  @IsString()
  @IsOptional()
  value?: string;
}
