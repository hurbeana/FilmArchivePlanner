import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { Contact } from './entities/contact.entity';
import { TagsService } from 'src/tags/tags.service';
import { TagsModule } from 'src/tags/tags.module';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    AutomapperModule,
    TagsModule,
    TypeOrmModule.forFeature([Tag]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService, TagsService],
})
export class ContactsModule {}
