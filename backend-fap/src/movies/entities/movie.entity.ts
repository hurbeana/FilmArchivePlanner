import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Movie {
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
  originalTitle: string;

  @AutoMap()
  @Column()
  englishTitle: string;

  @AutoMap()
  @Column()
  movieFile: string; //TODO Replace this with "Path"

  @AutoMap()
  @Column({ nullable: true })
  previewFile?: string; //TODO Replace this with "Path"

  @AutoMap()
  @Column({ nullable: true })
  trailerFile?: string; //TODO Replace this with "Path"

  @AutoMap()
  @Column('simple-array', { nullable: true }) //Replace simple-array?
  stillFiles?: string[]; //TODO Replace this with "Path[]"

  @AutoMap()
  @Column('simple-array', { nullable: true }) //Replace simple-array?
  subtitleFiles?: string[]; //TODO Replace this with "Path"

  @AutoMap()
  @Column('simple-array') //Replace simple-array?
  directors: string[]; //TODO Add directress and replace String

  @AutoMap()
  @Column('simple-array', { nullable: true }) //Replace simple-array?
  countriesOfProduction?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @Column({ nullable: true })
  yearOfProduction?: number;

  @AutoMap()
  @Column('bigint')
  duration: number;

  @AutoMap()
  @Column('simple-array', { nullable: true }) //Replace simple-array
  animationTechniques?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @Column('simple-array', { nullable: true }) //Replace simple-array
  softwareUsed?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @Column('simple-array', { nullable: true }) //Replace simple-array
  keywords?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @Column()
  germanSynopsis: string;

  @AutoMap()
  @Column()
  englishSynopsis: string;

  @AutoMap()
  @Column()
  submissionCategory: string; //TODO Replace with Tag

  @AutoMap()
  @Column({ nullable: true })
  hasDialog?: boolean;

  @AutoMap()
  @Column('simple-array', { nullable: true }) //Replace simple-array
  dialogLanguages?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @Column({ nullable: true })
  hasSubtitles?: boolean;

  @AutoMap()
  @Column()
  isStudentFilm: boolean;

  @AutoMap()
  @Column({ nullable: true })
  filmSchool?: string;

  @AutoMap()
  @Column({ nullable: true })
  script?: string;

  @AutoMap()
  @Column({ nullable: true })
  animation?: string;

  @AutoMap()
  @Column({ nullable: true })
  editing?: string;

  @AutoMap()
  @Column({ nullable: true })
  sound?: string;

  @AutoMap()
  @Column({ nullable: true })
  music?: string;

  @AutoMap()
  @Column({ nullable: true })
  productionCompany?: string;

  @AutoMap()
  @Column()
  contact: string; //TODO Change to Contact type
}
