import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUpdateTagDto } from './dto/create-update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { Tag } from './entities/tag.entity';
import { TagDto } from './dto/tag.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { SearchTagDto } from './dto/search-tag.dto';
import { TagType } from './tagtype.enum';

/**
 * Service for tags CRUD
 */
@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectMapper()
    private mapper: Mapper,
  ) {
    this.mapper.createMap(Tag, TagDto);
  }

  private readonly logger = new Logger(TagsService.name);

  /**
   * Saves a tag to the database
   * @param createTagDto The tag to save
   * @returns {Promise<TagDto>} The created tag, including id and timestamps
   */
  async create(createTagDto: CreateUpdateTagDto): Promise<TagDto> {
    await this.validateTag(createTagDto);
    createTagDto.value = createTagDto.value.toLowerCase(); //tags should be case insensitive
    const tagParam = this.tagRepository.create(createTagDto);
    const createdTag = await this.tagRepository.save(tagParam);
    return this.mapTagToDto(createdTag);
  }

  /**
   * Retrieve Tag List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchstring
   * @returns {Promise<Pagination<TagDto>>} The tags in a paginated form
   */
  find(
    options: IPaginationOptions,
    search: SearchTagDto,
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchstring: string,
  ): Promise<Pagination<TagDto>> {
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');
    if (searchstring) {
      // searchstring higher prio
      Object.keys(SearchTagDto.getStringSearch()).forEach((k) =>
        queryBuilder.orWhere(`tag.${k} ILIKE :${k}`, {
          [k]: `%${searchstring}%`,
        }),
      );
    } else if (search) {
      Object.entries(search)
        .filter(([, v]) => v) // filter empty properties
        .forEach(([k, v]) => {
          if (typeof v === 'number' || typeof v === 'boolean') {
            queryBuilder.orWhere(`tag.${k} = :${k}`, { [k]: v });
          } else if (typeof v === 'string') {
            queryBuilder.orWhere(`tag.${k} ILIKE :${k}`, {
              [k]: `%${v}%`,
            });
          } else {
            //TODO: more types?
          }
        });
    }
    if (orderBy) {
      queryBuilder.orderBy(orderBy, sortOrder);
    }
    return paginate<Tag>(queryBuilder, options).then(
      (page) =>
        new Pagination<TagDto>(
          page.items.map((entity) => this.mapTagToDto(entity)),
          page.meta,
          page.links,
        ),
    );
  }

  /**
   * Returns the tag with the specified id
   * @param id the id of the tag to return
   * @returns {Promise<TagDto>} The tag with the specified id
   */
  async findOne(id: number): Promise<TagDto> {
    let tag: Tag;
    try {
      tag = await this.tagRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Getting tag with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    return this.mapTagToDto(tag);
  }

  /**
   * Returns all tags with specified tag type
   * @param tagType the type of the tags to return
   * @returns {Promise<TagDto[]>} List of tags with specified type
   */
  async findType(tagType: TagType): Promise<TagDto[]> {
    let tags: Tag[];
    try {
      tags = await this.tagRepository.find({ where: { type: tagType } });
    } catch (e) {
      this.logger.error(
        `Getting tags with tagtype ${tagType} failed.`,
        e.stack,
      );
      throw new NotFoundException(); //Is this the right exception for tagType not in Enum?
    }
    const dtos: TagDto[] = [];

    if (tags.length > 0) {
      tags.forEach((tag) => {
        dtos.push(this.mapTagToDto(tag));
      });
    }
    return dtos;
  }

  /**
   * Updates the tag with the specified id
   * @param id the id of the tag to update
   * @param updateTagDto the tag to update
   * @returns {Promise<TagDto>} The updated tag
   */
  async update(id: number, updateTagDto: CreateUpdateTagDto): Promise<TagDto> {
    await this.validateTag(updateTagDto);
    updateTagDto.value = updateTagDto.value.toLowerCase();
    try {
      await this.tagRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Getting tag with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const tagParam = this.tagRepository.create(updateTagDto);
    tagParam.id = id;
    const updatedTag = await this.tagRepository.save(tagParam);
    return this.mapTagToDto(updatedTag);
  }

  /**
   * Deletes the tag with the specified id from the database
   * @param id the id of the tag to delete
   */
  async delete(id: number): Promise<void> {
    try {
      await this.tagRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Deleting tag with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    await this.tagRepository.delete(id);
  }

  private mapTagToDto(tag: Tag): TagDto {
    return this.mapper.map(tag, TagDto, Tag);
  }

  private async validateTag(tag: CreateUpdateTagDto) {
    if (
      !tag.value ||
      !tag.type ||
      !tag.user ||
      !(tag.public === true || tag.public === false)
    ) {
      this.logger.error(
        `Creating/updating tag failed. All values must be defined.`,
      );
      throw new BadRequestException(`All tag fields must be defined.`);
    }
  }
}
