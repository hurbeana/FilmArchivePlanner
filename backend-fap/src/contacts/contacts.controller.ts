import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateUpdateContactDto } from './dto/create-update-contact.dto';
import { SearchContactPagingDto } from './dto/search-contact-paging.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

/**
 * Controller for contacts.
 * Contains REST endpoints for contacts CRUD.
 */
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  private readonly logger = new Logger(ContactsController.name);

  @Post()
  create(@Body() createContactDto: CreateUpdateContactDto) {
    this.logger.log('Create contact called.');
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll(@Query() searchPaging: SearchContactPagingDto) {
    this.logger.log('Get contacts called.');
    this.logger.log(searchPaging);
    const { page, limit, orderBy, sortOrder, searchString, ...search } =
      searchPaging;
    const p: IPaginationOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
    };
    return this.contactsService.find(
      p,
      search,
      orderBy,
      sortOrder,
      searchString,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Get contact with id ${id} called.`);
    return this.contactsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateContactDto: CreateUpdateContactDto,
  ) {
    this.logger.log(`Update contact with id ${id} called.`);
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.log(`Delete contact with id ${id} called.`);
    return this.contactsService.delete(id);
  }

  @Get('/contactIdIsInUse/:id')
  tagIsUsed(@Param('id') id: number) {
    this.logger.log(`Get if tag with id ${id} is in use.`);
    return this.contactsService.contactIdIsInUse(id);
  }
}
