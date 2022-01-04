import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Director } from '../../directors/entities/director.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { Tag } from '../../tags/entities/tag.entity';
import {
  MovieFile,
  DCPFile,
  PreviewFile,
  TrailerFile,
  StillFile,
  SubtitleFile,
} from './moviefiles.entity';

@Entity()
export class Movie {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  folderId: string;

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

  @AutoMap({ typeFn: () => MovieFile })
  @OneToMany(() => MovieFile, (file) => file.movie)
  movieFiles?: MovieFile[];

  @AutoMap({ typeFn: () => DCPFile })
  @OneToMany(() => DCPFile, (file) => file.movie)
  dcpFiles?: DCPFile[];

  @AutoMap({ typeFn: () => PreviewFile })
  @OneToOne(() => PreviewFile, (file) => file.movie, { eager: true })
  previewFile?: PreviewFile;

  @AutoMap({ typeFn: () => TrailerFile })
  @OneToOne(() => TrailerFile, (file) => file.movie, { eager: true })
  trailerFile?: TrailerFile;

  @AutoMap({ typeFn: () => StillFile })
  @OneToMany(() => StillFile, (file) => file.movie)
  stillFiles?: StillFile[];

  @AutoMap({ typeFn: () => SubtitleFile })
  @OneToMany(() => SubtitleFile, (file) => file.movie)
  subtitleFiles?: SubtitleFile[];

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

  @AutoMap({ typeFn: () => Tag })
  @ManyToMany(() => Tag)
  @JoinTable()
  selectionTags?: Tag[];
}
