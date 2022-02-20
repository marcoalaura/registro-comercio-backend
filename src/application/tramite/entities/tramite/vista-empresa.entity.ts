import { PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'v_empresas',
  materialized: true,
  synchronize: false,
})
export class EmpresasView {
  @PrimaryColumn()
  @ViewColumn({ name: 'id' })
  id: number;

  @ViewColumn({ name: 'razon_social' })
  razonSocial: string;

  @ViewColumn({ name: 'objeto_social' })
  objetoSocial: string;

  @ViewColumn({ name: 'actividad_economica' })
  codActividad: string;

  @ViewColumn({ name: 'estado' })
  estado: string;
}
