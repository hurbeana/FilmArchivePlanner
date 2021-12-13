import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { TagType } from '../tagtype.enum';

@Entity()
export class Tag {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @CreateDateColumn()
  created_at: Date;

  @AutoMap()
  @UpdateDateColumn()
  last_updated: Date;

  @AutoMap()
  @Column('text')
  type: TagType;

  @AutoMap()
  @Column()
  value: string;

  @AutoMap()
  @Column()
  user: string; //TODO: Replace with user entity

  @AutoMap()
  @Column({ default: true })
  public: boolean;
}
