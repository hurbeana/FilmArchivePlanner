import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Director } from '../../directors/entities/director.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { Tag } from '../../tags/entities/tag.entity';

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

  @AutoMap({ typeFn: () => Director })
  @ManyToMany(() => Director)
  @JoinTable()
  directors: Director[];

  @AutoMap({ typeFn: () => Tag })
  @ManyToMany(() => Tag)
  @JoinTable()
  countriesOfProduction?: Tag[];

  @AutoMap()
  @Column({ nullable: true })
  yearOfProduction?: number;

  @AutoMap()
  @Column('bigint')
  duration: number;

  @AutoMap({ typeFn: () => Tag })
  @ManyToMany(() => Tag)
  @JoinTable()
  animationTechniques?: Tag[];

  @AutoMap({ typeFn: () => Tag })
  @ManyToMany(() => Tag)
  @JoinTable()
  softwareUsed?: Tag[];

  @AutoMap({ typeFn: () => Tag })
  @ManyToMany(() => Tag)
  @JoinTable()
  keywords?: Tag[];

  @AutoMap()
  @Column()
  germanSynopsis: string;

  @AutoMap()
  @Column()
  englishSynopsis: string;

  @AutoMap({ typeFn: () => Tag })
  @ManyToMany(() => Tag)
  @JoinTable()
  submissionCategories: Tag[];

  @AutoMap()
  @Column({ nullable: true })
  hasDialog?: boolean;

  @AutoMap({ typeFn: () => Tag })
  @ManyToMany(() => Tag)
  @JoinTable()
  dialogLanguages?: Tag[];

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
  @ManyToOne(() => Contact)
  contact: Contact;
}
