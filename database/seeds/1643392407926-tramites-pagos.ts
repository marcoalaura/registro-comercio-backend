import { MigrationInterface, QueryRunner } from "typeorm";
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { TramitePago } from 'src/application/tramite/entities/tramite/tramite-pago.entity';
import { Status } from 'src/common/constants'

export class tramitesPagos1643392407926 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        monto: 500,
        canalSolicitud: 'canal 1',
        canalPago: 'canal pago 1',
        transaccion: {
          idTransaccion: '3cb24d82-df33-433c-b3a8-6f068d1288a1',
          codigoOrden: '1A-1B-1C-AA',
        },
        // rutaFactura: 'ruta factura 1',
        // numeroFactura: '00001',
        estado: Status.PENDING,
        tramite: 1
      },
      {
        monto: 200,
        canalSolicitud: 'canal 2',
        canalPago: 'canal pago 2',
        // rutaFactura: 'ruta factura 2',
        // numeroFactura: '00002',
        transaccion: {
          idTransaccion: '3cb24d82-df33-433c-b3a8-6f068d1288a0',
          codigoOrden: 'A4456654654654',
        },
        estado: Status.ACTIVE,
        tramite: 2
      },
    ];
    const tramitesPagos = items.map((item) => {
      const t = new Tramite();
      t.id = item.tramite;

      const tp = new TramitePago();
      tp.monto = item.monto;
      tp.canalSolicitud = item.canalSolicitud;
      tp.canalPago = item.canalPago;
      tp.transaccion = item.transaccion;
      tp.estado = item.estado;
      // tp.rutaFactura = item.rutaFactura;
      // tp.numeroFactura = item.numeroFactura;
      tp.fechaCreacion = new Date();
      tp.usuarioCreacion = 'SEEDER';
      tp.tramite = t;
      return tp;
    });
    await queryRunner.manager.save(tramitesPagos);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
