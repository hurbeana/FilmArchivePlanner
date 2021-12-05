import { CreateUpdateTagDto } from './create-update-tag.dto';
import { AutoMap } from '@automapper/classes';
import { IsNumber } from 'class-validator';

export class TagDto extends CreateUpdateTagDto {
  @AutoMap()
  @IsNumber()
  id: number;

  @AutoMap()
  created_at: Date;

  @AutoMap()
  last_updated: Date;
}
