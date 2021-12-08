import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUpdateContactDto } from './dto/create-update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { Contact } from './entities/contact.entity';
import { ContactDto } from './dto/contact.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { SearchContactDto } from './dto/search-contact.dto';
import { TagReferenceDto } from '../tags/dto/tag-reference.dto';
import { TagsService } from '../tags/tags.service';
import { TagType } from '../tags/tagtype.enum';

/**
 * Service for contacts CRUD
 */
@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectMapper()
    private mapper: Mapper,
    private readonly tagsService: TagsService,
    private entityManager: EntityManager,
  ) {
    this.mapper.createMap(Contact, ContactDto);
  }

  private readonly logger = new Logger(ContactsService.name);

  /**
   * Saves a contact to the database
   * @param createContactDto The contact to save
   * @returns {Promise<ContactDto>} The created contact, including id and timestamps
   */
  async create(createContactDto: CreateUpdateContactDto): Promise<ContactDto> {
    await this.validateEmailAndPhone(createContactDto);
    await this.checkIfReferencedTagExists(createContactDto.type);
    const contactParam = this.contactRepository.create(createContactDto);
    const createdContact = await this.contactRepository.save(contactParam);
    return this.findOne(createdContact.id);
  }

  /**
   * Retrieve Contact List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchstring
   * @returns {Promise<Pagination<ContactDto>>} The contacts in a paginated form
   */
  find(
    options: IPaginationOptions,
    search: SearchContactDto,
    orderBy = 'id',
    //TODO: Change to sort by name (requires changes in Store in Frontend)
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    searchstring: string,
  ): Promise<Pagination<ContactDto>> {
    let whereObj = [];
    let orderObj = {};
    if (searchstring) {
      // searchstring higher prio
      whereObj = Object.keys(SearchContactDto.getStringSearch()).map((k) =>
        k === 'type'
          ? {
              [k]: { value: ILike('%' + searchstring + '%') },
            }
          : {
              [k]: ILike('%' + searchstring + '%'),
            },
      );
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
    if (orderBy) {
      orderObj = { [orderBy]: sortOrder };
    }
    return paginate<Contact>(this.contactRepository, options, {
      relations: ['type'],
      where: whereObj,
      order: orderObj,
    }).then(
      (page) =>
        new Pagination<ContactDto>(
          page.items.map((entity) => this.mapContactToDto(entity)),
          page.meta,
          page.links,
        ),
    );
  }

  /**
   * Returns the contact with the specified id
   * @param id the id of the contact to return
   * @returns {Promise<ContactDto>} The contact with the specified id
   */
  async findOne(id: number): Promise<ContactDto> {
    let contact: Contact;
    try {
      contact = await this.contactRepository.findOneOrFail({
        where: { id },
        relations: ['type'],
      });
    } catch (e) {
      this.logger.error(`Getting contact with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    return this.mapContactToDto(contact);
  }

  /**
   * Updates the contact with the specified id
   * @param id the id of the contact to update
   * @param updateContactDto the contact to update
   * @returns {Promise<ContactDto>} The updated contact
   */
  async update(
    id: number,
    updateContactDto: CreateUpdateContactDto,
  ): Promise<ContactDto> {
    await this.validateEmailAndPhone(updateContactDto);
    await this.checkIfReferencedTagExists(updateContactDto.type);
    try {
      await this.contactRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Updating contact with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const contactParam = this.contactRepository.create(updateContactDto);
    contactParam.id = id;
    const updatedContact = await this.contactRepository.save(contactParam);
    return this.findOne(updatedContact.id);
  }

  /**
   * Deletes the contact with the specified id from the database
   * @param id the id of the contact to delete
   */
  async delete(id: number): Promise<void> {
    try {
      await this.contactRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Deleting contact with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    await this.contactRepository.delete(id);
  }

  /**
   * Checks if a Tag is referenced in some other table
   * @param contactId the id of the tag that we want to know if it is "used"
   */
  async contactIdIsInUse(contactId: number): Promise<boolean> {
    try {
      const result = await this.entityManager.query(
        `SELECT "contactId" FROM  "movie" WHERE "contactId" = $1`,
        [contactId],
      );
      return result.length > 0;
    } catch (e) {
      this.logger.error(
        `Checking if contact with id ${contactId} is in use failed.`,
        e.stack,
      );
      throw new NotFoundException();
    }
  }

  private mapContactToDto(contact: Contact): ContactDto {
    return this.mapper.map(contact, ContactDto, Contact);
  }

  private async validateEmailAndPhone(contact: CreateUpdateContactDto) {
    if (!contact.email && !contact.phone) {
      this.logger.error(
        `Creating/updating contact ${contact.name} without email and phone failed. At least one must be defined.`,
      );
      throw new BadRequestException(
        `Contact ${contact.name} must have a phone or an email.`,
      );
    }
  }

  private async checkIfReferencedTagExists(tag: TagReferenceDto) {
    let result;
    try {
      result = await this.tagsService.findOne(tag.id);
    } catch (e) {
      this.logger.error(`Could not find tag ${tag.id}`, e.stack);
      throw new BadRequestException(`Tag ${tag.id} does not exist`);
    }
    if (result.type !== TagType.Contact) {
      throw new BadRequestException(
        `The TagType of tag ${tag.id} must be TagType.Contact`,
      );
    }
    return result;
  }
}
