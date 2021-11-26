import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

const mockId = 1;
const mockUpdatedAt = new Date();
const mockCreatedAt = new Date();

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let directorsService: DirectorsService;
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
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    directorsService = module.get<DirectorsService>(DirectorsService);
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
      .mockImplementation((): Promise<Director> => {
        return new Promise(function (resolve) {
          resolve(new Director());
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
    const createUpdateMovieDto = new CreateUpdateMovieDto();
    createUpdateMovieDto.directors = [];
    return moviesService.update(1, createUpdateMovieDto).catch((error) => {
      console.log(error.stack);
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
    expect(() => moviesService.findOne(6)).toThrow(NotFoundException);
  });
});

function initializeMovieDto(movieDto: CreateUpdateMovieDto) {
  const director1 = new DirectorReferenceDto();
  director1.id = 1;
  const director2 = new DirectorReferenceDto();
  director2.id = 2;

  movieDto.originalTitle = 'a';
  movieDto.englishTitle = 'b';
  movieDto.movieFile = 'c';
  movieDto.directors = [director1, director2];
  movieDto.duration = 12;
  movieDto.germanSynopsis = 'd';
  movieDto.englishSynopsis = 'g';
  movieDto.contact = 'h';
  movieDto.submissionCategory = 'i';
  movieDto.isStudentFilm = true;
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
  movie.directors = [director1, director2];

  movie.originalTitle = createMovie.originalTitle;
  movie.englishTitle = createMovie.englishTitle;
  movie.movieFile = createMovie.movieFile;
  movie.duration = createMovie.duration;
  movie.germanSynopsis = createMovie.germanSynopsis;
  movie.englishSynopsis = createMovie.englishSynopsis;
  movie.contact = createMovie.contact;
  movie.submissionCategory = createMovie.submissionCategory;
  movie.isStudentFilm = createMovie.isStudentFilm;
  return movie;
}
