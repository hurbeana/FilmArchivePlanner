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
    const { page, limit, orderBy, sortOrder, searchString, ...search } =
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
      searchString,
    );
  }

  @Get('/all')
  findAllWOPaging() {
    this.logger.log(`Get all directors without paging called.`);
    // TODO change back to findAllWOPaging() if needed
    return this.directorsService.findAllAsRefWOPaging();
  }

  @Get('/allAsRefs')
  findAllAsRefsWOPaging() {
    this.logger.log(`Get all directors as references without paging called.`);
    return this.directorsService.findAllAsRefWOPaging();
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

  @Get('/directorIdIsInUse/:id')
  directorIsUsed(@Param('id') id: number) {
    this.logger.log(`Get if director with id ${id} is in use.`);
    return this.directorsService.directorIdIsInUse(id);
  }
}
