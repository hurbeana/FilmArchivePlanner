import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { EntityManager, Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CreateUpdateContactDto } from './dto/create-update-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TagReferenceDto } from '../tags/dto/tag-reference.dto';
import { TagType } from '../tags/tagtype.enum';
import { Tag } from '../tags/entities/tag.entity';
import { TagsService } from '../tags/tags.service';

const mockId = 1;
const mockUpdatedAt = new Date();
const mockCreatedAt = new Date();

describe('ContactsService', () => {
  let contactsService: ContactsService;
  let tagsService: TagsService;
  let repo: Repository<Contact>;

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

    contactsService = module.get<ContactsService>(ContactsService);
    tagsService = module.get<TagsService>(TagsService);
    repo = module.get<Repository<Contact>>(getRepositoryToken(Contact));
  });

  it('should be defined', () => {
    expect(contactsService).toBeDefined();
  });

  test('given createContactDto when create then return contact with id and timestamps', async () => {
    const createContactDto = new CreateUpdateContactDto();
    initializeContactDto(createContactDto);

    const contactDto = new ContactDto();
    initializeContactDto(contactDto);
    contactDto.id = mockId;
    contactDto.created_at = mockCreatedAt;
    contactDto.last_updated = mockUpdatedAt;

    jest.spyOn(tagsService, 'findOne').mockImplementation((): Promise<Tag> => {
      return new Promise(function (resolve) {
        const tag = new Tag();
        tag.type = TagType.Contact;
        resolve(tag);
      });
    });

    jest
      .spyOn(repo, 'save')
      .mockImplementation((contact: Contact): Promise<Contact> => {
        return mockRepoSave(contact);
      });

    jest
      .spyOn(repo, 'create')
      .mockImplementation((createContact: CreateUpdateContactDto): Contact => {
        return mockRepoCreate(createContact);
      });

    jest
      .spyOn(contactsService, 'findOne')
      .mockImplementation((): Promise<Contact> => {
        return new Promise(function (resolve) {
          resolve(mockRepoSave(mockRepoCreate(createContactDto)));
        });
      });

    expect(await contactsService.create(createContactDto)).toEqual(contactDto);
  });

  test('given no phone or email when create then throw BadRequestException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return contactsService
      .create(new CreateUpdateContactDto())
      .catch((error) => expect(error).toBeInstanceOf(BadRequestException));
  });

  test('given nonexistent id when update then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    jest.spyOn(tagsService, 'findOne').mockImplementation((): Promise<Tag> => {
      return new Promise(function (resolve) {
        const tag = new Tag();
        tag.type = TagType.Contact;
        resolve(tag);
      });
    });
    const contact = new CreateUpdateContactDto();
    const tag = new Tag();
    tag.type = TagType.Contact;
    contact.type = tag;
    contact.phone = '12345'; // add phone so the phone/email constraint is satisfied
    return contactsService
      .update(1, contact)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });

  test('given no phone or email when update then throw BadRequestException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return contactsService
      .update(1, new CreateUpdateContactDto())
      .catch((error) => expect(error).toBeInstanceOf(BadRequestException));
  });

  test('given updateContactDto when update then return updated contact', async () => {
    const updateContactDto = new CreateUpdateContactDto();
    initializeContactDto(updateContactDto);

    const contactDto = new ContactDto();
    initializeContactDto(contactDto);
    contactDto.id = mockId;
    contactDto.created_at = mockCreatedAt;
    contactDto.last_updated = mockUpdatedAt;

    jest.spyOn(tagsService, 'findOne').mockImplementation((): Promise<Tag> => {
      return new Promise(function (resolve) {
        const tag = new Tag();
        tag.type = TagType.Contact;
        resolve(tag);
      });
    });

    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      return new Promise(function (resolve) {
        resolve(new Contact());
      });
    });

    jest
      .spyOn(repo, 'create')
      .mockImplementation((createContact: CreateUpdateContactDto): Contact => {
        return mockRepoCreate(createContact);
      });

    jest
      .spyOn(repo, 'save')
      .mockImplementation((contact: Contact): Promise<Contact> => {
        return mockRepoSave(contact);
      });

    jest
      .spyOn(contactsService, 'findOne')
      .mockImplementation((): Promise<Contact> => {
        return new Promise(function (resolve) {
          resolve(mockRepoSave(mockRepoCreate(updateContactDto)));
        });
      });

    expect(await contactsService.update(mockId, updateContactDto)).toEqual(
      contactDto,
    );
  });

  test('given nonexistent id when delete then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return contactsService
      .delete(1)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });

  test('given nonexistent id when get then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return contactsService
      .findOne(1)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });
});

function initializeContactDto(contactDto: CreateUpdateContactDto) {
  const tag = new TagReferenceDto();
  tag.id = 1;
  tag.type = TagType.Contact;
  //initializeTagReferenceDto(tagReferenceDto);

  contactDto.type = tag;
  contactDto.name = 'b';
  contactDto.email = 'c';
  contactDto.phone = 'd';
  contactDto.website = 'e';
}
/*
function initializeTagReferenceDto(tagReferenceDto: TagReferenceDto) {
  tagReferenceDto.type = TagType.Contact;
  tagReferenceDto.value = 'BusinessContact';
}
 */

function mockRepoSave(contact: Contact): Promise<Contact> {
  return new Promise(function (resolve) {
    contact.id = mockId;
    contact.created_at = mockCreatedAt;
    contact.last_updated = mockUpdatedAt;
    resolve(contact);
  });
}

function mockRepoCreate(
  createUpdateContactDto: CreateUpdateContactDto,
): Contact {
  const contact = new Contact();

  const tag = new Tag();
  tag.id = createUpdateContactDto.type.id;
  tag.type = TagType.Contact;

  contact.type = tag;
  contact.name = createUpdateContactDto.name;
  contact.email = createUpdateContactDto.email;
  contact.phone = createUpdateContactDto.phone;
  contact.website = createUpdateContactDto.website;
  return contact;
}
