import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { App } from '../apps/app.entity';

@Entity()
export class Check {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => App, { onDelete: 'CASCADE' })
  app: App;

  @Column()
  success: boolean;

  @Column()
  responseTime: number;

  @Column()
  statusCode: number;

  @CreateDateColumn()
  createdAt: Date;
}
