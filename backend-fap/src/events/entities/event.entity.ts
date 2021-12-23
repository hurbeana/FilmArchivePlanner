import { Type } from 'class-transformer';
import { Allow, IsDate, IsOptional, IsString } from 'class-validator';
import { Festival } from '../../festivals/entities/festival.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Tag } from '../../tags/entities/tag.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tag)
  @Type(() => Tag)
  @Allow()
  type: Tag;

  @IsDate()
  @Column()
  startDate: Date;

  @IsDate()
  @Column()
  endDate: Date;

  @IsString()
  @Column()
  eventLocation: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  description?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  responsiblePerson?: string;

  @ManyToOne(() => Festival, (f) => f.events)
  @JoinColumn()
  @Type(() => Festival)
  @Allow()
  festival: Festival;

  @ManyToOne(() => Movie)
  @JoinColumn()
  @Type(() => Movie)
  @Allow()
  movie?: Movie;
}
