import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Festival } from './entities/festival.entity';
import ical from 'ical-generator';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class FestivalsService extends TypeOrmCrudService<Festival> {
  private readonly logger = new Logger(FestivalsService.name);

  constructor(@InjectRepository(Festival) repo) {
    super(repo);
  }

  async exportFestivalToIcal(id: number): Promise<StreamableFile> {
    this.logger.log(`Exporting Fesival with id: ${id} as calendar`);
    return this.findOne({
      where: { id },
      relations: [
        'events',
        'events.movie',
        'events.movie.contact',
        'events.movie.directors',
      ],
    }).then((festival: Festival) => {
      const calendar = ical({
        name: festival.name,
        description: festival.description,
      });
      calendar.events(
        festival.events.map((e) => ({
          start: e.startDate,
          end: e.endDate,
          summary: e.title,
          description: e.description ?? this.getMovieText(e.movie),
          location: festival.location + ' - ' + e.eventLocation,
        })),
      );
      const buffer = Buffer.from(calendar.toString(), 'utf8');
      return new StreamableFile(buffer);
    });
  }

  /*
   * Information of the movie to be printend*/
  getMovieText(m: Movie) {
    return `${m.originalTitle}
${m.englishTitle}
directresses: ${m.directors
      .map((d) => d.firstName + ' ' + d.middleName + ' ' + d.lastName)
      .join(',')}
duration: ${m.duration}
Contact: 
${m.contact.name}
${m.contact.email}
${m.contact.phone}
${m.contact.website}
`;
  }

  /**
   * Checks if a Festival is referenced in some other table
   * @param festivalId the id of the tag that we want to know if it is "used"
   */
  async hasEvents(festivalId: number): Promise<boolean> {
    try {
      const f = await this.repo.findOneOrFail({ where: { id: festivalId } });
      return f.events?.length > 0;
    } catch (e) {
      this.logger.error(
        `Checking if festival with id ${festivalId} has events failed.`,
        e.stack,
      );
      throw new NotFoundException();
    }
  }
}
