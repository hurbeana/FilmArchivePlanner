import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';
import { MovieDto } from './dto/movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;
  const mockId = 1;
  const mockUpdatedAt = new Date();
  const mockCreatedAt = new Date();

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
          useValue: {
            create: jest.fn((createMovie: CreateUpdateMovieDto) => {
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
            }),
            save: jest.fn((movie: Movie) => {
              return new Promise(function (resolve) {
                movie.id = mockId;
                movie.created_at = mockCreatedAt;
                movie.last_updated = mockUpdatedAt;
                resolve(movie);
              });
            }),
          },
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

  test('given createMovieDto when create then return movie with id and timestamps', () => {
    const createMovieDto = new CreateUpdateMovieDto();
    initializeMovieDto(createMovieDto);

    const movieDto = new MovieDto();
    initializeMovieDto(movieDto);
    movieDto.id = mockId;
    movieDto.created_at = mockCreatedAt;
    movieDto.last_updated = mockUpdatedAt;

    return service.create(createMovieDto).then((movie) => {
      expect(movie).toEqual(movieDto);
    });
  });

  /*it('should return for findAll', async () => {
    // mock file for reuse
    const testPhoto: Photo =  {
      id: 'a47ecdc2-77d6-462f-9045-c440c5e4616f',
      name: 'hello',
      description: 'the description',
      isPublished: true,
      filename: 'testFile.png',
      views: 5,
    };
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(repo, 'find').mockResolvedValueOnce([testPhoto]);
    expect(await service.findAll()).toEqual([testPhoto]);
  });*/
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
