import { FilesModule } from './../files/files.module';
import { Module } from '@nestjs/common';
import { DirectorsService } from './directors.service';
import { DirectorsController } from './directors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { Director } from './entities/director.entity';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from './entities/directorfiles.entity';
import { ConfigService } from '@nestjs/config';
import { createFilesOptions } from 'src/config/files-config.functions';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Director,
      BiographyEnglishFile,
      BiographyGermanFile,
      FilmographyFile,
    ]),
    FilesModule.forRootAsync({
      imports: [],
      useFactory: createFilesOptions,
      inject: [ConfigService],
    }),
    AutomapperModule,
  ],
  controllers: [DirectorsController],
  providers: [DirectorsService],
})
export class DirectorsModule {}
