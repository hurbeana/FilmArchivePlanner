import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

export class File {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  path?: string;

  @AutoMap()
  @Column()
  filename?: string;

  @AutoMap()
  @Column()
  mimetype?: string;
}
