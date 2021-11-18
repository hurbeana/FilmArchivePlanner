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
import { DirectorsService } from './directors.service';
import { CreateUpdateDirectorDto } from './dto/create-update-director.dto';
import { SearchDirectorPagingDto } from './dto/search-director-paging.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

/**
 * Controller for directors.
 * Contains REST endpoints for directors CRUD.
 */
@Controller('directors')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  private readonly logger = new Logger(DirectorsController.name);

  @Post()
  create(@Body() createDirectorDto: CreateUpdateDirectorDto) {
    this.logger.log('Create director called.');
    return this.directorsService.create(createDirectorDto);
  }

  @Get()
  findAll(@Query() searchPaging: SearchDirectorPagingDto) {
    this.logger.log('Get directors called.');
    this.logger.log(searchPaging);
    const { limit, page, orderBy, sortOrder, searchstring, ...search } =
      searchPaging;
    const p: IPaginationOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
    };
    return this.directorsService.find(
      p,
      search,
      orderBy,
      sortOrder,
      searchstring,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Get director with id ${id} called.`);
    return this.directorsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDirectorDto: CreateUpdateDirectorDto,
  ) {
    this.logger.log(`Update director with id ${id} called.`);
    return this.directorsService.update(id, updateDirectorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.log(`Delete director with id ${id} called.`);
    return this.directorsService.delete(id);
  }
}