import { CreateUpdateDirectorDto } from './create-update-director.dto';
import { AutoMap } from '@automapper/classes';

export class DirectorDto extends CreateUpdateDirectorDto {
  @AutoMap()
  id: number;

  @AutoMap()
  created_at: Date;

  @AutoMap()
  last_updated: Date;
}
