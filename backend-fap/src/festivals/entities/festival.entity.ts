import { IsOptional, IsString, ValidateNested } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated: Date;

  @IsString()
  @Column()
  name: string;

  @IsString()
  @Column()
  location: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  description?: string;

  @ValidateNested({ always: true })
  @OneToMany(() => Event, (ev) => ev.festival, { eager: true })
  @IsOptional()
  events: Event[];
}
