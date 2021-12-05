import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { File } from '../../files/entities/file.entity';
import { Director } from './director.entity';

@Entity()
export class BiographyEnglishFile extends File {
  @OneToOne(() => Director, (director) => director.biographyEnglish)
  @JoinColumn()
  director: Director;
}

@Entity()
export class BiographyGermanFile extends File {
  @OneToOne(() => Director, (director) => director.biographyGerman)
  @JoinColumn()
  director: Director;
}

@Entity()
export class FilmographyFile extends File {
  @OneToOne(() => Director, (director) => director.filmography)
  @JoinColumn()
  director: Director;
}
