import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from '../directors/entities/directorfiles.entity';
import {
  DCPFile,
  MovieFile,
  PreviewFile,
  StillFile,
  SubtitleFile,
  TrailerFile,
} from './entities/moviefiles.entity';
import { Movie } from './entities/movie.entity';
import { Global, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorsModule } from '../directors/directors.module';
import { Director } from '../directors/entities/director.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { Contact } from '../contacts/entities/contact.entity';
import { Tag } from '../tags/entities/tag.entity';

@Global()
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
  exports: [MoviesService],
})
export class MoviesModule {}
