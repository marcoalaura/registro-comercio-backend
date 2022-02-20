import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity('sessions', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  data: string;
}
