import { EntityRepository, Repository } from 'typeorm';

import { TramiteLiquidacion } from '../entities/tramite/tramite-liquidacion.entity';
import { Tramite } from '../entities/tramite/tramite.entity';

// import { Status } from '../../../common/constants';
import { CrearLiquidacionDTO } from '../dto/tramite-liquidacion.dto';

@EntityRepository(TramiteLiquidacion)
export class LiquidacionRepository extends Repository<TramiteLiquidacion> {
  async crearLiquidacion(data: CrearLiquidacionDTO) {
    const tramite = new Tramite();
    tramite.id = data.idTramite;
    return this.save({ ...data, tramite });
  }

  async buscarPorIdTramite(id: string) {
    const tramite = new Tramite();
    tramite.id = parseInt(id, 10);
    const response = await this.find({
      where: { tramite },
      select: ['id', 'descripcion', 'monto'],
    });
    return response;
  }
}
