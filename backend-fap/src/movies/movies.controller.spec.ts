import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { DirectorsService } from '../directors/directors.service';
import { Director } from '../directors/entities/director.entity';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/entities/contact.entity';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/entities/tag.entity';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from '../directors/entities/directorfiles.entity';
import { FILES_PERSISTENCY_PROVIDER } from '../files/files.constants';
import {
  MovieFile,
  DCPFile,
  PreviewFile,
  TrailerFile,
  StillFile,
  SubtitleFile,
} from './entities/moviefiles.entity';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          options: [{ name: '', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        DirectorsService,
        {
          provide: getRepositoryToken(Director),
          useClass: Repository,
        },
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository,
        },
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MovieFile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DCPFile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PreviewFile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TrailerFile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StillFile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SubtitleFile),
          useClass: Repository,
        },
        {
          provide: FILES_PERSISTENCY_PROVIDER,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Director),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BiographyEnglishFile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BiographyGermanFile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(FilmographyFile),
          useClass: Repository,
        },
        {
          provide: FILES_PERSISTENCY_PROVIDER,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /*describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });*/
});
