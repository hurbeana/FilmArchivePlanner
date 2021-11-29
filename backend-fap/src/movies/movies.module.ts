import { Movie } from './entities/movie.entity';
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { DirectorsService } from '../directors/directors.service';
import { DirectorsModule } from '../directors/directors.module';
import { Director } from '../directors/entities/director.entity';
import { ContactsService } from '../contacts/contacts.service';
import { ContactsModule } from '../contacts/contacts.module';
import { Contact } from '../contacts/entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    AutomapperModule,
    DirectorsModule,
    TypeOrmModule.forFeature([Director]),
    ContactsModule,
    TypeOrmModule.forFeature([Contact]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, DirectorsService, ContactsService],
})
export class MoviesModule {}
