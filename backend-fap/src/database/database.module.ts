import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './database-config.service';

@Module({
  imports: [ConfigModule],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule {}
