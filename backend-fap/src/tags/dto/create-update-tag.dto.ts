import { AutoMap } from '@automapper/classes';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { TagType } from '../tagtype.enum';

export class CreateUpdateTagDto {
  @AutoMap()
  @IsEnum(TagType)
  type: TagType;

  @AutoMap()
  @IsString()
  value: string;

  @AutoMap()
  @IsString()
  user: string; //TODO: Replace with UserReferenceDto

  @AutoMap()
  @IsBoolean()
  public: boolean;
}
