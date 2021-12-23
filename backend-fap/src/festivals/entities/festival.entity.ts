import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

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
