import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService,
      {
        provide: getRepositoryToken(Movie),
        useClass: Repository
      }],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    // Save the instance of the repository and set the correct generics
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
