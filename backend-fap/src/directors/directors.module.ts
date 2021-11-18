import { Module } from '@nestjs/common';
import { DirectorsService } from './directors.service';
import { DirectorsController } from './directors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { Director } from './entities/director.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), AutomapperModule],
  controllers: [DirectorsController],
  providers: [DirectorsService],
})
export class DirectorsModule {}
