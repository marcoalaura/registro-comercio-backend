import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametricaCategoria } from 'src/application/tramite/entities/parametricas/parametrica-categoria.entity'
import { Status, TramiteParametricaTipoCatalogo } from 'src/common/constants/index';

export class publicacionesCategorias1644415937030 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1001,
                nombre: 'INSTRUMENTOS',
                orden: 1
            }, // 7
            {
                id: 1002,
                nombre: 'CONVOCATORIAS Y AVISOS',
                orden: 2
            },
            {
                id: 1003,
                nombre: 'MEMORIAS',
                orden: 3
            },
            {
                id: 1004,
                nombre: 'BALANCES',
                orden: 4
            }
        ];
        const categorias = items.map((item) => {
            const pc = new ParametricaCategoria();
            pc.fechaCreacion = new Date();
            pc.usuarioCreacion = 'SEEDER'
            pc.tipoCatalogo = TramiteParametricaTipoCatalogo.PUBLICACION;
            pc.estado = Status.ACTIVE;
            pc.nombre = item.nombre;
            pc.orden = item.orden;
            pc.id = item.id;
            return pc;
        });
        await queryRunner.manager.save(categorias);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
