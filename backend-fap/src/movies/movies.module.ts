import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from './../directors/entities/directorfiles.entity';
import {
  DCPFile,
  MovieFile,
  PreviewFile,
  StillFile,
  SubtitleFile,
  TrailerFile,
} from './entities/moviefiles.entity';
import { Movie } from './entities/movie.entity';
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorsModule } from '../directors/directors.module';
import { Director } from '../directors/entities/director.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { Contact } from '../contacts/entities/contact.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movie,
      MovieFile,
      DCPFile,
      PreviewFile,
      TrailerFile,
      StillFile,
      SubtitleFile,
      Director,
      BiographyEnglishFile,
      BiographyGermanFile,
      FilmographyFile,
      Contact,
      Tag,
    ]),
    DirectorsModule,
    ContactsModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
