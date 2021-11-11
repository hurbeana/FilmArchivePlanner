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

const mockId = 1;
const mockUpdatedAt = new Date();
const mockCreatedAt = new Date();

describe('MoviesService', () => {
  let service: MoviesService;
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
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    // Save the instance of the repository and set the correct generics
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      .spyOn(repo, 'save')
      .mockImplementation((movie: Movie): Promise<Movie> => {
        return mockRepoSave(movie);
      });

    jest
      .spyOn(repo, 'create')
      .mockImplementation((createMovie: CreateUpdateMovieDto): Movie => {
        return mockRepoCreate(createMovie);
      });

    expect(await service.create(createMovieDto)).toEqual(movieDto);
  });

  test('given nonexistent id when update then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return service
      .update(1, new CreateUpdateMovieDto())
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });

  test('given updateMovieDto for existing id when update then return updated movie', async () => {
    const updateMovieDto = new CreateUpdateMovieDto();
    initializeMovieDto(updateMovieDto);

    const movieDto = new MovieDto();
    initializeMovieDto(movieDto);
    movieDto.id = mockId;
    movieDto.created_at = mockCreatedAt;
    movieDto.last_updated = mockUpdatedAt;

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

    expect(await service.update(mockId, updateMovieDto)).toEqual(movieDto);
  });
});

function initializeMovieDto(movieDto: CreateUpdateMovieDto) {
  movieDto.originalTitle = 'a';
  movieDto.englishTitle = 'b';
  movieDto.movieFile = 'c';
  movieDto.directors = ['e', 'f'];
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
  movie.originalTitle = createMovie.originalTitle;
  movie.englishTitle = createMovie.englishTitle;
  movie.movieFile = createMovie.movieFile;
  movie.directors = createMovie.directors;
  movie.duration = createMovie.duration;
  movie.germanSynopsis = createMovie.germanSynopsis;
  movie.englishSynopsis = createMovie.englishSynopsis;
  movie.contact = createMovie.contact;
  movie.submissionCategory = createMovie.submissionCategory;
  movie.isStudentFilm = createMovie.isStudentFilm;
  return movie;
}
