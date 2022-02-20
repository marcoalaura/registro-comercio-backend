import { EntityRepository, Repository } from 'typeorm';

import { CrearInformacionFinancieraDto } from '../dto/informacion-financiera.dto';

import { Empresa } from '../entities/empresa.entity';
import { InformacionFinanciera } from '../entities/informacion_financiera.entity';

import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';

@EntityRepository(InformacionFinanciera)
export class InformacionFinancieraRepository extends Repository<InformacionFinanciera> {
  //
  async listarPorIdEmpresa(id: string) {
    const queryBuilder = await this.createQueryBuilder('informacion-financiera')
      .where('id_empresa= :id', { id })
      .getMany();
    return queryBuilder;
  }

  async buscarPorId(id: number) {
    const data = await this.createQueryBuilder('informacion-financiera')
      .leftJoinAndSelect('informacion-financiera.empresa', 'empresa')
      .select([
        'informacion-financiera.id',
        'informacion-financiera.gestion',
        'informacion-financiera.activosCorrientes',
        'informacion-financiera.activosFijos',
        'informacion-financiera.valoracionActivos',
        'informacion-financiera.otrosActivos',
        'informacion-financiera.activosBrutos',
        'informacion-financiera.activosNetos',
        'informacion-financiera.pasivosCorrientes',
        'informacion-financiera.obligacionesLargoPlazo',
        'informacion-financiera.totalPasivos',
        'informacion-financiera.patrimonioLiquido',
        'informacion-financiera.pasivoMasPatrimonio',
        'informacion-financiera.ventasNetas',
        'informacion-financiera.costoVentas',
        'informacion-financiera.utilidadOperacional',
        'informacion-financiera.utilidadBruta',
        'informacion-financiera.codTipoMoneda',
        'informacion-financiera.fechaBalance',
        'informacion-financiera.gestionBalance',
        'informacion-financiera.mesCierreGestion',
        'informacion-financiera.libroRegistroBalance',
        'informacion-financiera.numeroRegistroBalance',
        'informacion-financiera.activoDisponible',
        'informacion-financiera.activoExigible',
        'informacion-financiera.activoRealizable',
        'informacion-financiera.otrosActivosCorrientes',
        'informacion-financiera.activosNoCorrientes',
        'informacion-financiera.pasivosNoCorrientes',
        'informacion-financiera.patrimonio',
        'informacion-financiera.resultadoInscripcion',
        'informacion-financiera.totalIngresos',
        'informacion-financiera.totalGastos',
        'informacion-financiera.totalGastosOperativos',
        'informacion-financiera.capital',
        'empresa.id',
        'empresa.razonSocial',
      ])
      .where('informacion-financiera.id = :id', { id })
      .getOne();
    if (!data) {
      throw new EntityNotFoundException(Messages.EXCEPTION_NOT_FOUND);
    }
    return data;
  }

  async crear(data: CrearInformacionFinancieraDto, idEmpresa: string) {
    const empresa = new Empresa();
    empresa.id = parseInt(idEmpresa, 10);
    return this.save({ ...data, empresa });
  }
}
