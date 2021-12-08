import { Module } from '@nestjs/common';
import { DirectorsService } from './directors.service';
import { DirectorsController } from './directors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Director } from './entities/director.entity';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from './entities/directorfiles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Director,
      BiographyEnglishFile,
      BiographyGermanFile,
      FilmographyFile,
    ]),
  ],
  controllers: [DirectorsController],
  providers: [DirectorsService],
  exports: [DirectorsService],
})
export class DirectorsModule {}
