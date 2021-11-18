import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Director {
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
  @Column()
  firstName: string;

  @AutoMap()
  @Column({ nullable: true })
  middleName?: string;

  @AutoMap()
  @Column()
  lastName: string;

  @AutoMap()
  @Column()
  biographyEnglish: string; //TODO Replace this with "Path"

  @AutoMap()
  @Column({ nullable: true })
  biographyGerman?: string; //TODO Replace this with "Path"

  @AutoMap()
  @Column({ nullable: true })
  filmography?: string; //TODO Replace this with "Path"
}
