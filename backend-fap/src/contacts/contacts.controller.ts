import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateUpdateContactDto } from './dto/create-update-contact.dto';
import { Crud, CrudController } from '@nestjsx/crud';
import { Contact } from './entities/contact.entity';

/**
 * Controller for contacts.
 * Contains REST endpoints for contacts CRUD.
 */
@Crud({
  model: {
    type: Contact,
  },
  query: {
    join: {
      type: {},
    },
  },
})
@Controller('contacts')
export class ContactsController implements CrudController<Contact> {
  constructor(public service: ContactsService) {}

  private readonly logger = new Logger(ContactsController.name);

  @Post()
  create(@Body() createContactDto: CreateUpdateContactDto) {
    this.logger.log('Create contact called.');
    return this.service.create(createContactDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Get contact with id ${id} called.`);
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateContactDto: CreateUpdateContactDto,
  ) {
    this.logger.log(`Update contact with id ${id} called.`);
    return this.service.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.log(`Delete contact with id ${id} called.`);
    return this.service.delete(id);
  }

  @Get('/contactIdIsInUse/:id')
  tagIsUsed(@Param('id') id: number) {
    this.logger.log(`Get if tag with id ${id} is in use.`);
    return this.service.contactIdIsInUse(id);
  }
}
