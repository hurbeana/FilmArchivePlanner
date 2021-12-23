import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService extends TypeOrmCrudService<Event> {
  constructor(@InjectRepository(Event) repo) {
    super(repo);
  }
}
