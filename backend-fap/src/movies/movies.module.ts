import { Movie } from './entities/movie.entity';
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), AutomapperModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
