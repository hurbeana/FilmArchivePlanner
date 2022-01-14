import { Type } from 'class-transformer';
import { Allow, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Festival } from '../../festivals/entities/festival.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Tag } from '../../tags/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventType } from '../event.enum';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated: Date;

  @IsString()
  @Column()
  title: string;

  @IsEnum(EventType)
  @Column()
  type: EventType;

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
