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
          useClass: Repository,
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
