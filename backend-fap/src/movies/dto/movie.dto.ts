import { CreateUpdateMovieDto } from './create-update-movie.dto';
import { AutoMap } from '@automapper/classes';

export class MovieDto extends CreateUpdateMovieDto {
  @AutoMap()
  id: number;

  @AutoMap()
  created_at: Date;

  @AutoMap()
  last_updated: Date;
}
