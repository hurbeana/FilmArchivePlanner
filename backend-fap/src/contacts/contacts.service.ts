import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUpdateContactDto } from './dto/create-update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { Contact } from './entities/contact.entity';
import { ContactDto } from './dto/contact.dto';
import { TagReferenceDto } from '../tags/dto/tag-reference.dto';
import { TagsService } from '../tags/tags.service';
import { TagType } from '../tags/tagtype.enum';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

/**
 * Service for contacts CRUD
 */
@Injectable()
export class ContactsService extends TypeOrmCrudService<Contact> {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectMapper()
    private mapper: Mapper,
    private readonly tagsService: TagsService,
    private entityManager: EntityManager,
  ) {
    super(contactRepository);
    this.mapper.createMap(Contact, ContactDto);
  }

  private readonly logger = new Logger(ContactsService.name);

  /**
   * Saves a contact to the database
   * @param createContactDto The contact to save
   * @returns {Promise<ContactDto>} The created contact, including id and timestamps
   */
  async create(createContactDto: CreateUpdateContactDto): Promise<ContactDto> {
    await this.checkIfReferencedTagExists(createContactDto.type);
    const contactParam = this.contactRepository.create(createContactDto);
    const createdContact = await this.contactRepository.save(contactParam);
    return this.findOne(createdContact.id);
  }

  /**
  Returns all tags in an array
  @returns {Promise<ContactDto[]>} Array of all tags
  */
  async findAllWOPaging(): Promise<ContactDto[]> {
    let contacts: Contact[];
    try {
      contacts = await this.contactRepository.find();
    } catch (e) {
      this.logger.error(`Getting all contacts without paging failed.`, e.stack);
      throw new NotFoundException();
    }
    const dtos: ContactDto[] = [];

    if (contacts.length > 0) {
      contacts.forEach((tag) => {
        dtos.push(this.mapContactToDto(tag));
      });
    }
    return dtos;
  }

  async findAll(): Promise<ContactDto> {
    let contacts;
    try {
      contacts = await this.contactRepository.find({
        where: {},
        relations: ['type'],
      });
    } catch (e) {
      this.logger.error(`Getting all contacts failed.`, e.stack);
      throw new NotFoundException();
    }
    return contacts.map((contact) => this.mapContactToDto(contact));
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
