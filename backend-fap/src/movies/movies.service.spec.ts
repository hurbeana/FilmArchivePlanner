import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { NotFoundException } from '@nestjs/common';
import { DirectorsService } from '../directors/directors.service';
import { Director } from '../directors/entities/director.entity';
import { DirectorReferenceDto } from '../directors/dto/director-reference.dto';
import { ContactReferenceDto } from '../contacts/dto/contact-reference.dto';
import { Contact } from '../contacts/entities/contact.entity';
import { ContactsService } from '../contacts/contacts.service';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/entities/tag.entity';
import { TagType } from '../tags/tagtype.enum';
import { DirectorDto } from '../directors/dto/director.dto';
import {
  DCPFile,
  MovieFile,
  PreviewFile,
  StillFile,
  SubtitleFile,
} from './entities/moviefiles.entity';
import { FILES_PERSISTENCY_PROVIDER } from '../files/files.constants';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from '../directors/entities/directorfiles.entity';

const mockId = 1;
const mockUpdatedAt = new Date();
const mockCreatedAt = new Date();

export class MockRepository<T> {
  public createQueryBuilder = jest.fn(() => this.queryBuilder);

  public manager = { transaction: (a) => Promise.resolve(a()) };
  public metadata = {
    connection: { options: { type: null } },
    columns: [],
    relations: [],
  };

  public save = jest.fn();
  public create = jest.fn(); // new
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

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let directorsService: DirectorsService;
  let contactsService: ContactsService;
  let tagsService: TagsService;
  let repo: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          options: [{ name: '', pluginInitializer: classes }],
          singular: true,
        }),
      ],
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

    moviesService = module.get<MoviesService>(MoviesService);
    directorsService = module.get<DirectorsService>(DirectorsService);
    contactsService = module.get<ContactsService>(ContactsService);
    tagsService = module.get<TagsService>(TagsService);
    // Save the instance of the repository and set the correct generics
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(moviesService).toBeDefined();
  });

  test('given createMovieDto when create then return movie with id and timestamps', async () => {
    const createMovieDto = new CreateUpdateMovieDto();
    initializeMovieDto(createMovieDto);

    const movieDto = new MovieDto();
    initializeMovieDto(movieDto);
    movieDto.id = mockId;
    movieDto.created_at = mockCreatedAt;
    movieDto.last_updated = mockUpdatedAt;

    jest
      .spyOn(directorsService, 'findOne')
      .mockImplementation((id: number): Promise<DirectorDto> => {
        return new Promise(function (resolve) {
          resolve(new DirectorDto());
        });
      });

    jest
      .spyOn(contactsService, 'findOne')
      .mockImplementation((): Promise<Contact> => {
        return new Promise(function (resolve) {
          resolve(new Contact());
        });
      });

    jest
      .spyOn(tagsService, 'findOne')
      .mockImplementation((tagId: number): Promise<Tag> => {
        return new Promise(function (resolve) {
          const tag = new Tag();
          setTagTypeById(tag, tagId);
          resolve(tag);
        });
      });

    jest
      .spyOn(repo, 'save')
      .mockImplementation((movie: Movie): Promise<Movie> => {
        return mockRepoSave(movie);
      });

    jest
      .spyOn(repo, 'create')
      .mockImplementation((createMovie: CreateUpdateMovieDto): Movie => {
        return mockRepoCreate(createMovie);
      });

    jest
      .spyOn(moviesService, 'findOne')
      .mockImplementation((): Promise<Movie> => {
        return new Promise(function (resolve) {
          resolve(mockRepoSave(mockRepoCreate(createMovieDto)));
        });
      });

    expect(await moviesService.create(createMovieDto)).toEqual(movieDto);
  });

  test('given nonexistent id when update then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });

    jest
      .spyOn(directorsService, 'findOne')
      .mockImplementation((): Promise<Director> => {
        return new Promise(function (resolve) {
          resolve(new Director());
        });
      });

    jest
      .spyOn(contactsService, 'findOne')
      .mockImplementation((): Promise<Contact> => {
        return new Promise(function (resolve) {
          resolve(new Contact());
        });
      });

    jest
      .spyOn(tagsService, 'findOne')
      .mockImplementation((tagId: number): Promise<Tag> => {
        return new Promise(function (resolve) {
          const tag = new Tag();
          setTagTypeById(tag, tagId);
          resolve(tag);
        });
      });

    const createUpdateMovieDto = new CreateUpdateMovieDto();
    createUpdateMovieDto.directors = [];
    createUpdateMovieDto.contact = new Contact();

    const animationTag1 = new Tag();
    animationTag1.type = TagType.Animation;
    animationTag1.id = 1;
    const animationTag2 = new Tag();
    animationTag2.type = TagType.Animation;
    animationTag2.id = 2;
    const categoryTag = new Tag();
    categoryTag.type = TagType.Category;
    categoryTag.id = 3;
    const countryTag = new Tag();
    countryTag.type = TagType.Country;
    countryTag.id = 4;
    const keywordTag = new Tag();
    keywordTag.type = TagType.Keyword;
    keywordTag.id = 5;
    const languageTag = new Tag();
    languageTag.type = TagType.Language;
    languageTag.id = 6;
    const softwareTag = new Tag();
    softwareTag.type = TagType.Software;
    softwareTag.id = 7;
    const selectionTag = new Tag();
    selectionTag.type = TagType.Selection;
    selectionTag.id = 8;
    createUpdateMovieDto.animationTechniques = [animationTag1, animationTag2];
    createUpdateMovieDto.submissionCategories = [categoryTag];
    createUpdateMovieDto.countriesOfProduction = [countryTag];
    createUpdateMovieDto.keywords = [keywordTag];
    createUpdateMovieDto.dialogLanguages = [languageTag];
    createUpdateMovieDto.softwareUsed = [softwareTag];
    createUpdateMovieDto.selectionTags = [selectionTag];

    return moviesService.update(1, createUpdateMovieDto).catch((error) => {
      expect(error).toBeInstanceOf(NotFoundException);
    });
  });

  test('given updateMovieDto for existing id when update then return updated movie', async () => {
    const updateMovieDto = new CreateUpdateMovieDto();
    initializeMovieDto(updateMovieDto);

    const movieDto = new MovieDto();
    initializeMovieDto(movieDto);
    movieDto.id = mockId;
    movieDto.created_at = mockCreatedAt;
    movieDto.last_updated = mockUpdatedAt;

    jest
      .spyOn(directorsService, 'findOne')
      .mockImplementation((): Promise<Director> => {
        return new Promise(function (resolve) {
          resolve(new Director());
        });
      });

    jest
      .spyOn(contactsService, 'findOne')
      .mockImplementation((): Promise<Contact> => {
        return new Promise(function (resolve) {
          resolve(new Contact());
        });
      });

    jest
      .spyOn(tagsService, 'findOne')
      .mockImplementation((tagId: number): Promise<Tag> => {
        return new Promise(function (resolve) {
          const tag = new Tag();
          setTagTypeById(tag, tagId);
          resolve(tag);
        });
      });

    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      return new Promise(function (resolve) {
        resolve(new Movie());
      });
    });

    jest
      .spyOn(repo, 'save')
      .mockImplementation((movie: Movie): Promise<Movie> => {
        return mockRepoSave(movie);
      });

    jest
      .spyOn(repo, 'create')
      .mockImplementation((createMovie: CreateUpdateMovieDto): Movie => {
        return mockRepoCreate(createMovie);
      });

    jest
      .spyOn(moviesService, 'findOne')
      .mockImplementation((): Promise<Movie> => {
        return new Promise(function (resolve) {
          resolve(mockRepoSave(mockRepoCreate(updateMovieDto)));
        });
      });

    expect(await moviesService.update(mockId, updateMovieDto)).toEqual(
      movieDto,
    );
  });

  test('given nonexistent id when delete then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return moviesService
      .delete(1)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });

  test('given nonexistent id when get then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new NotFoundException();
    });
    return moviesService
      .findOne(6)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });
});

function initializeMovieDto(movieDto: CreateUpdateMovieDto) {
  const director1 = new DirectorReferenceDto();
  director1.id = 1;
  const director2 = new DirectorReferenceDto();
  director2.id = 2;
  const contact1 = new ContactReferenceDto();
  contact1.id = 1;

  movieDto.originalTitle = 'a';
  movieDto.englishTitle = 'b';
  movieDto.directors = [director1, director2];
  movieDto.duration = 12;
  movieDto.germanSynopsis = 'd';
  movieDto.englishSynopsis = 'g';
  movieDto.contact = contact1;
  movieDto.isStudentFilm = true;
  addMockTagsToMovie(movieDto);
}

function mockRepoSave(movie: Movie): Promise<Movie> {
  return new Promise(function (resolve) {
    movie.id = mockId;
    movie.created_at = mockCreatedAt;
    movie.last_updated = mockUpdatedAt;
    resolve(movie);
  });
}

function mockRepoCreate(createMovie: CreateUpdateMovieDto): Movie {
  const movie = new Movie();

  const director1 = new Director();
  director1.id = createMovie.directors[0].id;
  const director2 = new Director();
  director2.id = createMovie.directors[1].id;
  const contact1 = new Contact();
  contact1.id = createMovie.contact.id;

  movie.originalTitle = createMovie.originalTitle;
  movie.englishTitle = createMovie.englishTitle;
  movie.directors = [director1, director2];
  movie.duration = createMovie.duration;
  movie.germanSynopsis = createMovie.germanSynopsis;
  movie.englishSynopsis = createMovie.englishSynopsis;
  movie.contact = contact1;
  movie.isStudentFilm = createMovie.isStudentFilm;
  addMockTagsToMovie(movie);
  return movie;
}

function addMockTagsToMovie(movie) {
  const animationTag1 = new Tag();
  animationTag1.type = TagType.Animation;
  animationTag1.id = 1;
  const animationTag2 = new Tag();
  animationTag2.type = TagType.Animation;
  animationTag2.id = 2;
  const categoryTag = new Tag();
  categoryTag.type = TagType.Category;
  categoryTag.id = 3;
  const countryTag = new Tag();
  countryTag.type = TagType.Country;
  countryTag.id = 4;
  const keywordTag = new Tag();
  keywordTag.type = TagType.Keyword;
  keywordTag.id = 5;
  const languageTag = new Tag();
  languageTag.type = TagType.Language;
  languageTag.id = 6;
  const softwareTag = new Tag();
  softwareTag.type = TagType.Software;
  softwareTag.id = 7;
  const selectionTag = new Tag();
  selectionTag.type = TagType.Selection;
  selectionTag.id = 8;

  movie.animationTechniques = [animationTag1, animationTag2];
  movie.submissionCategories = [categoryTag];
  movie.countriesOfProduction = [countryTag];
  movie.keywords = [keywordTag];
  movie.dialogLanguages = [languageTag];
  movie.softwareUsed = [softwareTag];
  movie.selectionTags = [selectionTag];
  return movie;
}

function setTagTypeById(tag, tagId) {
  switch (tagId) {
    case 1: {
      tag.type = TagType.Animation;
      break;
    }
    case 2: {
      tag.type = TagType.Animation;
      break;
    }
    case 3: {
      tag.type = TagType.Category;
      break;
    }
    case 4: {
      tag.type = TagType.Country;
      break;
    }
    case 5: {
      tag.type = TagType.Keyword;
      break;
    }
    case 6: {
      tag.type = TagType.Language;
      break;
    }
    case 7: {
      tag.type = TagType.Software;
      break;
    }
    case 8: {
      tag.type = TagType.Selection;
      break;
    }
  }
  return tag;
}
