import { Movie } from './entities/movie.entity';
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { DirectorsService } from '../directors/directors.service';
import { DirectorsModule } from '../directors/directors.module';
import { Director } from '../directors/entities/director.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    AutomapperModule,
    DirectorsModule,
    TypeOrmModule.forFeature([Director]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, DirectorsService],
})
export class MoviesModule {}
