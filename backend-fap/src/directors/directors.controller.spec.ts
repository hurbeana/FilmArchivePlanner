import { Test, TestingModule } from '@nestjs/testing';
import { DirectorsController } from './directors.controller';
import { DirectorsService } from './directors.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Director } from './entities/director.entity';
import { Repository } from 'typeorm';

describe('DirectorsController', () => {
  let controller: DirectorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          options: [{ name: '', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      controllers: [DirectorsController],
      providers: [
        DirectorsService,
        {
          provide: getRepositoryToken(Director),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<DirectorsController>(DirectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
