import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUpdateContactDto } from './dto/create-update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const contactParam = this.contactRepository.create(createContactDto);
    const createdContact = await this.contactRepository.save(contactParam);
    return this.mapContactToDto(createdContact);
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
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchstring: string,
  ): Promise<Pagination<ContactDto>> {
    const queryBuilder = this.contactRepository.createQueryBuilder('contact');
    if (searchstring) {
      // searchstring higher prio
      Object.keys(SearchContactDto.getStringSearch()).forEach((k) =>
        queryBuilder.orWhere(`contact.${k} ILIKE :${k}`, {
          [k]: `%${searchstring}%`,
        }),
      );
    } else if (search) {
      Object.entries(search)
        .filter(([, v]) => v) // filter empty properties
        .forEach(([k, v]) => {
          if (typeof v === 'number' || typeof v === 'boolean') {
            queryBuilder.orWhere(`contact.${k} = :${k}`, { [k]: v });
          } else if (typeof v === 'string') {
            queryBuilder.orWhere(`contact.${k} ILIKE :${k}`, {
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
    return paginate<Contact>(queryBuilder, options).then(
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
      contact = await this.contactRepository.findOneOrFail(id);
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
    try {
      await this.contactRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Getting contact with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const contactParam = this.contactRepository.create(updateContactDto);
    contactParam.id = id;
    const updatedContact = await this.contactRepository.save(contactParam);
    return this.mapContactToDto(updatedContact);
  }

  /**
   * Deletes the contact with the specified id from the database
   * @param id the id of the contact to delete
   */
  async delete(id: number): Promise<void> {
    try {
      await this.contactRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Deleting contact with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    await this.contactRepository.delete(id);
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
}
