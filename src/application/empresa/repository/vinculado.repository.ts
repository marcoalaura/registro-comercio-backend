import { EntityRepository, Repository } from 'typeorm';
import { Vinculado } from '../entities/vinculado.entity';
import { Status } from '../../../common/constants';
// import { CrearVinculadoDto } from '../dto/vinculado.dto';
// import { Empresa } from '../entities/empresa.entity';

// import { Actions } from '../../../common/constants/audit-actions';

@EntityRepository(Vinculado)
export class VinculadoRepository extends Repository<Vinculado> {
  async listarPorIdEmpresa(id: string) {
    const queryBuilder = await this.createQueryBuilder('vinculado')
      .innerJoinAndSelect('vinculado.establecimiento', 'establecimiento')
      .select([
        'vinculado.id',
        'vinculado.cod_tipo_vinculo',
        'vinculado.cod_cargo',
        'vinculado.cod_libro_designacion',
        'vinculado.registro_designacion',
        'vinculado.fecha_vinculacion',
        'vinculado.cod_control_revocado',
        'vinculado.cod_libro_revocatoria',
        'vinculado.registro_revocatoria',
        'vinculado.fecha_revocatoria',
        'vinculado.id_establecimiento',
        'vinculado.id_persona',
        'vinculado.id_persona_juridica',
        'vinculado.fecha_creacion',
        'vinculado.usuario_creacion',
        'vinculado.fecha_actualizacion',
        'vinculado.usuario_actualizacion',
        'vinculado.fecha_baja',
        'vinculado.usuario_baja',
        'vinculado.estado',
      ])
      .where('vinculado.estado = :estado', { estado: Status.ACTIVE })
      .andWhere('establecimiento.id_empresa = :id', { id })
      .getMany();
    return queryBuilder;
  }

  // buscarPorId(id: number) {
  //   return this.createQueryBuilder('vinculado')
  //     .leftJoinAndSelect('vinculado.empresa', 'empresa')
  //     .select(['vinculado.id', 'vinculado.estado', 'empresa.id'])
  //     .where('vinculado.id = :id', { id })
  //     .getOne();
  // }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }
}
