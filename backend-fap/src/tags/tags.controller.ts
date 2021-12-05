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
import { TagsService } from './tags.service';
import { CreateUpdateTagDto } from './dto/create-update-tag.dto';
import { SearchTagPagingDto } from './dto/search-tag-paging.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

/**
 * Controller for tags.
 * Contains REST endpoints for tags CRUD.
 */
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  private readonly logger = new Logger(TagsController.name);

  @Post()
  create(@Body() createTagDto: CreateUpdateTagDto) {
    this.logger.log('Create tag called.');
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(@Query() searchPaging: SearchTagPagingDto) {
    this.logger.log('Get tags called.');
    this.logger.log(searchPaging);
    const { limit, page, orderBy, sortOrder, searchstring, ...search } =
      searchPaging;
    const p: IPaginationOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
    };
    return this.tagsService.find(p, search, orderBy, sortOrder, searchstring);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Get tag with id ${id} called.`);
    return this.tagsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTagDto: CreateUpdateTagDto) {
    this.logger.log(`Update tag with id ${id} called.`);
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.log(`Delete tag with id ${id} called.`);
    return this.tagsService.delete(id);
  }
}
