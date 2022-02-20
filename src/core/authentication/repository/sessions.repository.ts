import { EntityRepository, Repository } from 'typeorm';

import { Session } from '../entity/session.entity';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  async obtenerAccessTokenCD(id: number) {
    return this.createQueryBuilder('sessions')
      .select("data::jsonb->'passport'->'user'->>'accessToken' as access_token")
      .where("data::jsonb->'passport'->'user'->'id'=:id", { id: `${id}` })
      .limit(1)
      .execute();
  }
}
