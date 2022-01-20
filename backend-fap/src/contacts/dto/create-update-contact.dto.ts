import { AutoMap } from '@automapper/classes';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { TagReferenceDto } from '../../tags/dto/tag-reference.dto';

export class CreateUpdateContactDto {
  @AutoMap()
  @IsNotEmptyObject()
  type: TagReferenceDto;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  email?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  phone?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  website?: string;
}
