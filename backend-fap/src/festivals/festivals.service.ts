import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Festival } from './entities/festival.entity';

@Injectable()
export class FestivalsService extends TypeOrmCrudService<Festival> {
  constructor(@InjectRepository(Festival) repo) {
    super(repo);
  }
}
