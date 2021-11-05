import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated: Date;

  @Column()
  originalTitle: String;

  @Column()
  englishTitle: String;

  @Column({ nullable: true })
  movieFile?: String; //TODO Replace this with "Path"

  @Column({ nullable: true })
  previewFile?: String; //TODO Replace this with "Path"

  @Column({ nullable: true })
  trailerFile?: String; //TODO Replace this with "Path"

  @Column('simple-array', { nullable: true }) //Replace simple-array?
  stillFiles?: String[]; //TODO Replace this with "Path[]"

  @Column('simple-array', { nullable: true }) //Replace simple-array?
  subtitleFiles?: String[]; //TODO Replace this with "Path"

  @Column('simple-array', { nullable: true }) //Replace simple-array?
  directors?: String[]; //TODO Add directress and replace String

  @Column('simple-array', { nullable: true }) //Replace simple-array?
  countriesOfProduction?: String[]; //TODO Replace with Tag[]

  @Column({ nullable: true })
  yearOfProduction?: number;

  @Column('bigint')
  duration: number;

  @Column('simple-array', { nullable: true }) //Replace simple-array
  animationTechniques?: String[]; //TODO Replace with Tag[]

  @Column('simple-array', { nullable: true }) //Replace simple-array
  softwareUsed?: String[]; //TODO Replace with Tag[]

  @Column('simple-array', { nullable: true }) //Replace simple-array
  keywords?: String[]; //TODO Replace with Tag[]

  @Column()
  germanSynopsis: String;

  @Column()
  englishSynopsis: String;

  @Column()
  submissionCategory: String; //TODO Replace with Tag

  @Column({ nullable: true })
  hasDialog?: Boolean;

  @Column('simple-array', { nullable: true }) //Replace simple-array
  dialogLanguages?: String[]; //TODO Replace with Tag[]

  @Column({ nullable: true })
  hasSubtitles?: Boolean;

  @Column()
  isStudentFilm: Boolean;

  @Column({ nullable: true })
  filmSchool?: String;

  @Column({ nullable: true })
  script?: String;

  @Column({ nullable: true })
  animation?: String;

  @Column({ nullable: true })
  editing?: String;

  @Column({ nullable: true })
  sound?: String;

  @Column({ nullable: true })
  music?: String;

  @Column({ nullable: true })
  productionCompany?: String;

  //contact: Contact; //TODO Add contact
}
