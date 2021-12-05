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
import { FilesModule } from './../files/files.module';
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
import { TagsService } from 'src/tags/tags.service';
import { TagsModule } from 'src/tags/tags.module';
import { Tag } from 'src/tags/entities/tag.entity';
import { createFilesOptions } from '../config/files-config.functions';
import { ConfigService } from '@nestjs/config';

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
    ]),
    FilesModule.forRootAsync({
      imports: [],
      useFactory: createFilesOptions,
      inject: [ConfigService],
    }),
    AutomapperModule,
    DirectorsModule,
    ContactsModule,
    TypeOrmModule.forFeature([Contact]),
    TagsModule,
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([
      Director,
      BiographyEnglishFile,
      BiographyGermanFile,
      FilmographyFile,
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, DirectorsService, ContactsService, TagsService],
})
export class MoviesModule {}
