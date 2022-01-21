import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from '../contacts/contacts.service';
import { DirectorsService } from '../directors/directors.service';
import { MoviesModule } from '../movies/movies.module';
import { MoviesService } from '../movies/movies.service';
import { TagsService } from '../tags/tags.service';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { FestivalsService } from '../festivals/festivals.service';

describe('ExportController', () => {
  let controller: ExportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: MoviesService,
          useValue: {},
        },
        {
          provide: DirectorsService,
          useValue: {},
        },
        {
          provide: ContactsService,
          useValue: {},
        },
        {
          provide: TagsService,
          useValue: {},
        },
        {
          provide: ExportService,
          useValue: {},
        },
        {
          provide: FestivalsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExportController>(ExportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
