import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
@Check('"email" IS NOT NULL OR "phone" IS NOT NULL')
export class Contact {
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
  @ManyToOne(() => Tag, { eager: true })
  type: Tag;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ nullable: true })
  email?: string;

  @AutoMap()
  @Column({ nullable: true })
  phone?: string;

  @AutoMap()
  @Column({ nullable: true })
  website?: string;
}
