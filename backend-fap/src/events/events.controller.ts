import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';

@Crud({
  model: {
    type: Event,
  },
  query: {
    join: {
      type: {},
      festival: {},
      movie: {},
    },
  },
})
@Controller('events')
export class EventsController implements CrudController<Event> {
  constructor(public service: EventsService) {}
}
