import { Module } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from './entities/festival.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Festival, Event])],
  controllers: [FestivalsController],
  providers: [FestivalsService],
  exports: [FestivalsService],
})
export class FestivalsModule {}
