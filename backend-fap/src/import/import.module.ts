import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Module({ providers: [ImportService], controllers: [ImportController] })
export class ImportModule {}
