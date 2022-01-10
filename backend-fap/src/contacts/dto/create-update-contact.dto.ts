import { AutoMap } from '@automapper/classes';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
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
  @IsEmail()
  @IsOptional()
  email?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  phone?: string;

  @AutoMap()
  @IsUrl()
  @IsOptional()
  website?: string;
}
