import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('refresh_tokens', { schema: process.env.DB_SCHEMA_EMPRESA })
export class RefreshTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'grant_id' })
  grantId: string;

  @Column()
  iat: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_revoked' })
  isRevoked: boolean;

  @Column({ type: 'jsonb' })
  data: Record<string, never>;
}
