import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ default: 300 })
  interval: number;

  @Column({ default: 200 })
  expectedStatus: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: 0 })
  failureCount: number;

  @Column({ type: 'datetime', nullable: true })
  lastCheck: Date;
}
