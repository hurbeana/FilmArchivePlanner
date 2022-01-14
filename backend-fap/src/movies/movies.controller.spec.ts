import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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

export class MockRepository<T> {
  public createQueryBuilder = jest.fn(() => this.queryBuilder);

  public manager = { transaction: (a) => Promise.resolve(a()) };
  public metadata = {
    connection: { options: { type: null } },
    columns: [],
    relations: [],
  };

  public save = jest.fn();
  public delete = jest.fn();
  public update = jest.fn();
  public findOne = jest.fn();
  public findOneOrFail = jest.fn();
  public find = jest.fn();
  public getMany = jest.fn();

  public queryBuilder = {
    offset: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    addFrom: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    delete: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  };
}

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
        EntityManager,
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: MockRepository,
        },
        DirectorsService,
        {
          provide: getRepositoryToken(Director),
          useClass: Repository,
        },
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useClass: MockRepository,
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
