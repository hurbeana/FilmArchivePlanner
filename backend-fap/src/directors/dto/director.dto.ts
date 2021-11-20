import { CreateUpdateDirectorDto } from './create-update-director.dto';
import { AutoMap } from '@automapper/classes';
import { IsNumber } from 'class-validator';

export class DirectorDto extends CreateUpdateDirectorDto {
  @AutoMap()
  @IsNumber()
  id: number;

  @AutoMap()
  created_at: Date;

  @AutoMap()
  last_updated: Date;
}
