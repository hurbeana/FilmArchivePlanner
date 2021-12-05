import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from './directorfiles.entity';

@Entity()
export class Director {
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
  firstName: string;

  @AutoMap()
  @Column({ nullable: true })
  middleName?: string;

  @AutoMap()
  @Column()
  lastName: string;

  @AutoMap({ typeFn: () => BiographyEnglishFile })
  @OneToOne(() => BiographyEnglishFile, (file) => file.director, {
    eager: true,
  })
  biographyEnglish: BiographyEnglishFile;

  @AutoMap({ typeFn: () => BiographyGermanFile })
  @OneToOne(() => BiographyGermanFile, (file) => file.director, { eager: true })
  biographyGerman?: BiographyGermanFile;

  @AutoMap({ typeFn: () => FilmographyFile })
  @OneToOne(() => FilmographyFile, (file) => file.director, { eager: true })
  filmography?: FilmographyFile;
}
