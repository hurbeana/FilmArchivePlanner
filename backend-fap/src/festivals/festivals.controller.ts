import { Controller, Get, Logger, Param } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { Crud, CrudController } from '@nestjsx/crud';
import { Festival } from './entities/festival.entity';

@Crud({
  model: {
    type: Festival,
  },
  query: {
    join: {
      events: {},
      'events.movie': {
        alias: 'eventMovie',
        persist: ['contact'],
      },
      'events.movie.contact': { alias: 'movieContact' },
    },
  },
})
@Controller('festivals')
export class FestivalsController implements CrudController<Festival> {
  constructor(public service: FestivalsService) {}

  private readonly logger = new Logger(FestivalsController.name);

  @Get('/hasEvents/:id')
  tagIsUsed(@Param('id') id: number) {
    this.logger.log(`Get if festival with id ${id} has events.`);
    return this.service.hasEvents(id);
  }
}
