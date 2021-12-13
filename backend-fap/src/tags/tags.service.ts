import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUpdateTagDto } from './dto/create-update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
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
    private entityManager: EntityManager,
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
   * @param searchString
   * @returns {Promise<Pagination<TagDto>>} The tags in a paginated form
   */
  find(
    options: IPaginationOptions,
    search: SearchTagDto,
    orderBy: string,
    sortOrder: string,
    searchString: string,
  ): Promise<Pagination<TagDto>> {
    let whereObj = [];
    let orderObj = {};
    if (searchString) {
      // searchString higher prio
      whereObj = Object.keys(SearchTagDto.getStringSearch()).map((k) => ({
        [k]: ILike('%' + searchString + '%'),
      }));
    } else if (search) {
      whereObj = Object.entries(search)
        .filter(([, v]) => v) // filter empty properties
        .map(([k, v]) => {
          if (typeof v === 'number' || typeof v === 'boolean') {
            return { [k]: v };
          } else if (typeof v === 'string') {
            return { [k]: ILike('%' + v + '%') };
          } else {
            //TODO: more types?
          }
        });
    }

    if (sortOrder && orderBy) {
      orderObj = { [orderBy]: sortOrder.toUpperCase() };
    } else {
      orderObj = { created_at: 'ASC' };
    }
    return paginate<Tag>(this.tagRepository, options, {
      relations: [],
      where: whereObj,
      order: orderObj,
    }).then(
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
      tag = await this.tagRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Getting tag with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    return this.mapTagToDto(tag);
  }

  async findAll(): Promise<TagDto> {
    let tags;
    try {
      tags = await this.tagRepository.find({
        where: {},
        relations: [],
      });
    } catch (e) {
      this.logger.error(`Getting all tags failed.`, e.stack);
      throw new NotFoundException();
    }
    return tags.map((tag) => this.mapTagToDto(tag));
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
    try {
      await this.tagRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Getting tag with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const tagParam = this.tagRepository.create(updateTagDto);
    tagParam.id = id;

    const updatedTag = await this.tagRepository.save(tagParam);
    return this.findOne(updatedTag.id);
  }

  /**
   * Deletes the tag with the specified id from the database
   * @param id the id of the tag to delete
   */
  async delete(id: number): Promise<void> {
    try {
      await this.tagRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Deleting tag with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    await this.tagRepository.delete(id);
  }

  /**
   * Checks if a Tag is referenced in some other table
   * @param tagId the id of the tag that we want to know if it is "used"
   */
  async tagIdIsInUse(tagId: number): Promise<boolean> {
    try {
      const result = await this.entityManager.query(
        `SELECT joinedTags."tagId" FROM (
                SELECT "tagId" FROM "movie_animation_techniques_tag" UNION
                SELECT "tagId" FROM "movie_countries_of_production_tag" UNION
                SELECT "tagId" FROM "movie_dialog_languages_tag" UNION
                SELECT "tagId" FROM "movie_keywords_tag" UNION
                SELECT "tagId" FROM "movie_software_used_tag" UNION
                SELECT "tagId" FROM "movie_submission_categories_tag" UNION
                SELECT "typeId" as "tagId" FROM "contact"
              ) as joinedTags
              WHERE joinedTags."tagId" = $1`,
        [tagId],
      );
      return result.length > 0;
    } catch (e) {
      this.logger.error(
        `Checking if tag with id ${tagId} is in use failed.`,
        e.stack,
      );
      throw new NotFoundException();
    }
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
