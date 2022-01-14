import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { EntityManager, Repository } from 'typeorm';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/entities/tag.entity';

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

describe('ContactsController', () => {
  let controller: ContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          options: [{ name: '', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      controllers: [ContactsController],
      providers: [
        EntityManager,
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useClass: MockRepository,
        },
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Tag,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
