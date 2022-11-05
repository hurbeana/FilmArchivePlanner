import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { File } from '../../files/entities/file.entity';
import { Movie } from './movie.entity';

@Entity()
export class MovieFile extends File {
  @ManyToOne(() => Movie, (movie) => movie.movieFiles, { eager: true })
  movie: Movie;
}

@Entity()
export class DCPFile extends File {
  @ManyToOne(() => Movie, (movie) => movie.dcpFiles, { eager: true })
  movie: Movie;
}

@Entity()
export class PreviewFile extends File {
  @OneToOne(() => Movie, (movie) => movie.previewFile)
  @JoinColumn()
  movie: Movie;
}

@Entity()
export class StillFile extends File {
  @ManyToOne(() => Movie, (movie) => movie.stillFiles, { eager: true })
  movie: Movie;
}

@Entity()
export class SubtitleFile extends File {
  @ManyToOne(() => Movie, (movie) => movie.subtitleFiles, { eager: true })
  movie: Movie;
}
