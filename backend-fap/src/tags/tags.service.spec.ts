import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CreateUpdateTagDto } from './dto/create-update-tag.dto';
import { TagDto } from './dto/tag.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TagType } from './tagtype.enum';

const mockId = 1;
const mockUpdatedAt = new Date();
const mockCreatedAt = new Date();

describe('TagsService', () => {
  let service: TagsService;
  let repo: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          options: [{ name: '', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    repo = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('given createTagDto when create then return tag with id and timestamps', async () => {
    const createTagDto = new CreateUpdateTagDto();
    initializeTagDto(createTagDto);

    const tagDto = new TagDto();
    initializeTagDto(tagDto);
    tagDto.id = mockId;
    tagDto.created_at = mockCreatedAt;
    tagDto.last_updated = mockUpdatedAt;

    jest.spyOn(repo, 'save').mockImplementation((tag: Tag): Promise<Tag> => {
      return mockRepoSave(tag);
    });

    jest
      .spyOn(repo, 'create')
      .mockImplementation((createTag: CreateUpdateTagDto): Tag => {
        return mockRepoCreate(createTag);
      });

    const tag = await service.create(createTagDto);
    expect(tag.id).toEqual(tagDto.id);
    expect(tag.public).toEqual(tagDto.public);
    expect(tag.type).toEqual(tagDto.type);
    expect(tag.user).toEqual(tagDto.user);
    expect(tag.value).toEqual(tagDto.value.toLowerCase()); // tags are all saved as lowercase
    expect(tag.created_at).toEqual(tagDto.created_at);
    expect(tag.last_updated).toEqual(tagDto.last_updated);
    //expect(await service.create(createTagDto)).toEqual(tagDto);
  });

  test('given no properties when create then throw BadRequestException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    return service
      .create(new CreateUpdateTagDto())
      .catch((error) => expect(error).toBeInstanceOf(BadRequestException));
  });

  test('given nonexistent id when update then throw NotFoundException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    const tag = new CreateUpdateTagDto();
    // add properties so all values are defined
    tag.type = TagType.Contact;
    tag.user = 'User';
    tag.public = false;
    tag.value = 'BusinessContact';
    return service
      .update(1, tag)
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });

  test('missing properties when update then throw BadRequestException', () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error();
    });
    const tag = new CreateUpdateTagDto();
    // add properties so all values are defined
    tag.type = TagType.Contact;
    tag.user = 'User';
    tag.public = false;
    //tag.value = "BusinessContact"
    return service
      .update(1, tag)
      .catch((error) => expect(error).toBeInstanceOf(BadRequestException));
  });

  test('given updateTagDto when update then return updated tag', async () => {
    const updateTagDto = new CreateUpdateTagDto();
    initializeTagDto(updateTagDto);

    const tagDto = new TagDto();
    initializeTagDto(tagDto);
    tagDto.id = mockId;
    tagDto.created_at = mockCreatedAt;
    tagDto.last_updated = mockUpdatedAt;

    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      return new Promise(function (resolve) {
        resolve(new Tag());
      });
    });

    jest.spyOn(repo, 'save').mockImplementation((tag: Tag): Promise<Tag> => {
      return mockRepoSave(tag);
    });

    jest
      .spyOn(repo, 'create')
      .mockImplementation((createTag: CreateUpdateTagDto): Tag => {
        return mockRepoCreate(createTag);
      });

    const tag = await service.update(mockId, updateTagDto);

    expect(tag.id).toEqual(tagDto.id);
    expect(tag.public).toEqual(tagDto.public);
    expect(tag.type).toEqual(tagDto.type);
    expect(tag.user).toEqual(tagDto.user);
    expect(tag.value).toEqual(tagDto.value.toLowerCase()); // tags are all saved as lowercase
    expect(tag.created_at).toEqual(tagDto.created_at);
    expect(tag.last_updated).toEqual(tagDto.last_updated);
    //expect(await service.update(mockId, updateTagDto)).toEqual(tagDto);
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

function initializeTagDto(tagDto: CreateUpdateTagDto) {
  tagDto.type = TagType.Contact;
  tagDto.public = true;
  tagDto.user = 'User';
  tagDto.value = 'BusinessContact';
}

function mockRepoSave(tag: Tag): Promise<Tag> {
  return new Promise(function (resolve) {
    tag.id = mockId;
    tag.created_at = mockCreatedAt;
    tag.last_updated = mockUpdatedAt;
    resolve(tag);
  });
}

function mockRepoCreate(createUpdateTagDto: CreateUpdateTagDto): Tag {
  const tag = new Tag();
  tag.type = createUpdateTagDto.type;
  tag.public = createUpdateTagDto.public;
  tag.user = createUpdateTagDto.user;
  tag.value = createUpdateTagDto.value;
  return tag;
}
