import { CasbinRule } from 'src/core/authorization/entity/casbin.entity';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // FRONTEND
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/usuarios',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/parametros',
        v2: 'read|update|create',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/politicas',
        v2: 'create|read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/home',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/usuarios',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/parametros',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/empresas',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/alertas',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/tramites/nuevo',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/tramites/solicitud',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/tramites/curso',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/tramites/observados',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/tramites/inscritos',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/misfacturas',
        v2: 'read|download',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/miscertificados',
        v2: 'read|download',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/tramites/inscripcion/individual-unipersonal',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/pagos/solicitar',
        v2: 'create|read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/parametros/:grupo/listado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/parametros/departamentos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/parametros/departamentos/territorios',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/tramites/paso',
        v2: 'POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/tramites/:idTramite/aprobaciondocumento',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_VENTANILLA,
        v1: '/bandeja/grupo',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_VENTANILLA,
        v1: '/bandeja/observados',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_VENTANILLA,
        v1: '/comunicaciones',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/juridico/pendientes',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/juridico/observados',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/juridico/concluidos',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/juridico/inscritos',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/comunicaciones',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/publicaciones/nuevo',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/publicaciones/solicitudes',
        v2: 'read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/publicaciones/porpagar',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/publicaciones/realizadas',
        v2: 'read|update',
        v3: 'frontend',
      },
      // {
      //   v0: RolEnum.EMPRESARIO,
      //   v1: '/publicaciones/busquedas',
      //   v2: 'read',
      //   v3: 'frontend',
      // },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/publicaciones/tarifas',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/publicaciones/manuales',
        v2: 'read',
        v3: 'frontend',
      },
      // BACKEND
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/politicas',
        v2: 'GET|POST|DELETE',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/politicas/:id',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/modulos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/cuenta/ciudadania',
        v2: 'POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/activacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/inactivacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/restauracion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/parametros',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/autorizacion/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/autorizacion/modulos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/usuarios',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/parametros',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/empresas/:idEmpresa/objetos-sociales',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/empresas/objetos-sociales/:id',
        v2: 'GET|PUT',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/empresas/:idEmpresa/capitales',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/empresas/:idEmpresa/informaciones-financieras',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/empresas/informaciones-financieras/:id',
        v2: 'GET|PUT',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/tramites/misTramites/:idEmpresa',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/documentosEmitidos/:idEmpresa',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/tramites/seguimiento/:idTramite',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/tramites/cambiarEstado',
        v2: 'POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/pagos/:idEmpresa',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: 'api/facturas/:idEmpresa',
        v2: 'GET',
        v3: 'backend'
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: 'api/facturas/solicitar/:idPago',
        v2: 'POST',
        v3: 'backend'
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: 'api/facturas/anular/:idFactura',
        v2: 'POST',
        v3: 'backend'
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: 'api/facturas/consultar/:idFactura',
        v2: 'GET',
        v3: 'backend'
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/observaciones/tramite/:idTramite',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/pagos/solicitar',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/pagos/:id/tramite',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/empresas/:id/establecimientos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_VENTANILLA,
        v1: '/api/tramite/bandejaGrupo',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_VENTANILLA,
        v1: '/api/tramite/bandejaObservados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_VENTANILLA,
        v1: '/api/tramite',
        v2: 'GET|PUT',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/api/juridico/pendientes',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/api/juridico/observados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/api/juridico/concluidos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/api/juridico/inscritos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_JURIDICO,
        v1: '/api/tramite',
        v2: 'GET|PUT',
        v3: 'backend',
      },
      // TODOS
      {
        v0: RolEnum.TODOS,
        v1: '/api/parametros/:grupo/listado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/autorizacion/permisos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/usuarios/cuenta/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/usuarios/cuenta/contrasena',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/clasificadores',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/publicacion-tramite/solicitados/listado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/publicacion-tramite/confirmados/listado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/publicacion-tramite/:id/anulacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/publicacion-tramite/:id',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/publicacion-tramite/:id/solicitud',
        v2: 'POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/publicaciones',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.EMPRESARIO,
        v1: '/api/publicaciones/:id',
        v2: 'GET',
        v3: 'backend',
      },
    ];
    const casbin = items.map((item) => {
      const c = new CasbinRule();
      c.ptype = 'p';
      c.v0 = item.v0;
      c.v1 = item.v1;
      c.v2 = item.v2;
      c.v3 = item.v3;
      return c;
    });
    await queryRunner.manager.save(casbin);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
