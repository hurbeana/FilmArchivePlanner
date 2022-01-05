import { Test, TestingModule } from '@nestjs/testing';
import { DirectorsService } from './directors.service';
import { EntityManager, Repository } from 'typeorm';
import { Director } from './entities/director.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CreateUpdateDirectorDto } from './dto/create-update-director.dto';
import { DirectorDto } from './dto/director.dto';
import { NotFoundException } from '@nestjs/common';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from './entities/directorfiles.entity';
import { FILES_PERSISTENCY_PROVIDER } from '../files/files.constants';
import { Tag } from '../tags/entities/tag.entity';

const mockId = 1;
const mockUpdatedAt = new Date();
const mockCreatedAt = new Date();

describe('DirectorsService', () => {
  let service: DirectorsService;
  let repo: Repository<Director>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          options: [{ name: '', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      providers: [
        DirectorsService,
        {
          provide: getRepositoryToken(Director),
          useClass: Repository,
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
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: FILES_PERSISTENCY_PROVIDER,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DirectorsService>(DirectorsService);
    repo = module.get<Repository<Director>>(getRepositoryToken(Director));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('given createDirectorDto when create then return director with id and timestamps', async () => {
    const createDirectorDto = new CreateUpdateDirectorDto();
    initializeDirectorDto(createDirectorDto);

    const directorDto = new DirectorDto();
    initializeDirectorDto(directorDto);
    directorDto.id = mockId;
    directorDto.created_at = mockCreatedAt;
    directorDto.last_updated = mockUpdatedAt;

    jest
      .spyOn(repo, 'save')
      .mockImplementation((director: Director): Promise<Director> => {
        return mockRepoSave(director);
      });

    jest
      .spyOn(repo, 'create')
      .mockImplementation(
        (createDirector: CreateUpdateDirectorDto): Director => {
          return mockRepoCreate(createDirector);
        },
      );

    jest
      .spyOn(service, 'findOne')
      .mockImplementation((id: number): Promise<DirectorDto> => {
        return new Promise(function (resolve) {
          resolve(directorDto); // TODO investigate the find one
        });
      });

    expect(await service.create(createDirectorDto)).toEqual(directorDto);
  });

  test('given nonexistent id when update then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return service
      .update(1, new CreateUpdateDirectorDto())
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });

  test('given updateDirectorDto when update then return updated director', async () => {
    const updateDirectorDto = new CreateUpdateDirectorDto();
    initializeDirectorDto(updateDirectorDto);

    const directorDto = new DirectorDto();
    initializeDirectorDto(directorDto);
    directorDto.id = mockId;
    directorDto.created_at = mockCreatedAt;
    directorDto.last_updated = mockUpdatedAt;

    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      return new Promise(function (resolve) {
        resolve(new Director());
      });
    });

    jest.spyOn(service, 'findOne').mockImplementation((): Promise<Director> => {
      return new Promise(function (resolve) {
        resolve(mockRepoSave(mockRepoCreate(updateDirectorDto)));
      });
    });

    jest
      .spyOn(repo, 'save')
      .mockImplementation((director: Director): Promise<Director> => {
        return mockRepoSave(director);
      });

    jest
      .spyOn(repo, 'create')
      .mockImplementation(
        (createDirector: CreateUpdateDirectorDto): Director => {
          return mockRepoCreate(createDirector);
        },
      );

    expect(await service.update(mockId, updateDirectorDto)).toEqual(
      directorDto,
    );
  });

  test('given nonexistent id when delete then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return service
      .delete(1)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });

  test('given nonexistent id when get then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return service
      .findOne(1)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });
});

function initializeDirectorDto(directorDto: CreateUpdateDirectorDto) {
  directorDto.firstName = 'd';
  directorDto.middleName = 'e';
  directorDto.lastName = 'f';
}

function mockRepoSave(director: Director): Promise<Director> {
  return new Promise(function (resolve) {
    director.id = mockId;
    director.created_at = mockCreatedAt;
    director.last_updated = mockUpdatedAt;
    resolve(director);
  });
}

function mockRepoCreate(
  createUpdateDirectorDto: CreateUpdateDirectorDto,
): Director {
  const director = new Director();
  director.firstName = createUpdateDirectorDto.firstName;
  director.middleName = createUpdateDirectorDto.middleName;
  director.lastName = createUpdateDirectorDto.lastName;
  return director;
}
