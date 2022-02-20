import { PropiedadesDto } from 'src/core/authorization/dto/crear-modulo.dto';
import { Modulo } from 'src/core/authorization/entity/modulo.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // MENU SESSION PRINCIPAL
      {
        nombre: 'Principal',
        url: '/principal',
        label: 'Principal',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 100,
        },
      }, // 1
      {
        nombre: 'inicio',
        url: '/home',
        label: 'Inicio',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 101,
        },
        fidModulo: 1,
      }, // 2
      {
        nombre: 'perfil',
        url: '/perfil',
        label: 'Perfil',
        propiedades: {
          icono: 'person',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 102,
        },
        fidModulo: 1,
      }, // 3
      /*{
        nombre: 'empresas',
        url: '/empresas',
        label: 'Empresas',
        propiedades: {
          icono: 'domain',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 103,
        },
        fidModulo: 1,
      },*/
      {
        nombre: 'tramites',
        url: '/tramites',
        label: 'Mis Trámites',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 200,
        }, // 4
      },
      {
        nombre: 'tramitesNuevo',
        url: '/tramites/nuevo',
        label: 'Nuevo',
        propiedades: {
          icono: 'add',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 201,
        },
        fidModulo: 4,
      }, // 5
      {
        nombre: 'tramitesSolicitud',
        url: '/tramites/solicitud',
        label: 'Solicitudes',
        propiedades: {
          icono: 'content_paste',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 202,
        },
        fidModulo: 4,
      }, // 6
      {
        nombre: 'tramitesCurso',
        url: '/tramites/curso',
        label: 'En curso',
        propiedades: {
          icono: 'pending_actions',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 203,
        },
        fidModulo: 4,
      }, // 7
      {
        nombre: 'tramitesObservados',
        url: '/tramites/observados',
        label: 'Observados',
        propiedades: {
          icono: 'assignment_late',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 204,
        },
        fidModulo: 4,
      }, // 8
      {
        nombre: 'tramitesInscritos',
        url: '/tramites/inscritos',
        label: 'Finalizados',
        propiedades: {
          icono: 'inventory',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 205,
        },
        fidModulo: 4,
      }, // 9
      {
        nombre: 'publicaciones',
        url: '/publicaciones',
        label: 'Mis Publicaciones',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 250,
        },
      }, // 10
      {
        nombre: 'publicacionesNuevo',
        url: '/publicaciones/nuevo',
        label: 'Nuevo',
        propiedades: {
          icono: 'add',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 251,
        },
        fidModulo: 10,
      }, // 11
      {
        nombre: 'facturas',
        url: '/facturas',
        label: 'Facturas',
        propiedades: {
          icono: 'receipt_long',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 300,
        },
      }, // 12
      {
        nombre: 'misFacturas',
        url: '/misfacturas',
        label: 'Mis Facturas',
        propiedades: {
          icono: 'receipt_long',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 301,
        },
        fidModulo: 12,
      }, // 13
      {
        nombre: 'certificados',
        url: '/certificados',
        label: 'Certificados',
        propiedades: {
          icono: 'collections_bookmark',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 400,
        },
      }, // 14
      {
        nombre: 'misCertificados',
        url: '/miscertificados',
        label: 'Mis Certificados',
        propiedades: {
          icono: 'collections_bookmark',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 401,
        },
        fidModulo: 14,
      }, // 15
      // MENU SECCION CONFIGURACIONES
      {
        nombre: 'configuraciones',
        url: '/configuraciones',
        label: 'Configuraciones Generales',
        propiedades: {
          icono: 'settings',
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
          orden: 500,
        },
      }, // 16
      {
        nombre: 'usuarios',
        url: '/usuarios',
        label: 'Usuarios',
        propiedades: {
          icono: 'manage_accounts',
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
          orden: 501,
        },
        fidModulo: 16,
      }, // 17
      {
        nombre: 'parametros',
        url: '/parametros',
        label: 'Parámetros',
        propiedades: {
          icono: 'tune',
          color_light: '#312403',
          color_dark: '#B77346',
          orden: 502,
        },
        fidModulo: 16,
      }, // 18
      {
        nombre: 'politicas',
        url: '/politicas',
        label: 'Politicas',
        propiedades: {
          icono: 'verified_user',
          color_light: '#B4AA99',
          color_dark: '#B4AA99',
          orden: 503,
        },
        fidModulo: 16,
      }, // 19
      // MENU PARA LAS SECCIONES DE TRAMITES INTERNOS
      {
        nombre: 'bandeja',
        url: '/bandeja',
        label: 'Bandeja',
        propiedades: {
          icono: 'list',
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
          orden: 600,
        },
      }, // 20
      {
        nombre: 'bandejaGrupo',
        url: '/bandeja/grupo',
        label: 'Bandeja de grupo',
        propiedades: {
          icono: 'pending_actions',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 601,
        },
        fidModulo: 20,
      }, // 21
      {
        nombre: 'bandejaObservados',
        url: '/bandeja/observados',
        label: 'Bandeja observados',
        propiedades: {
          icono: 'assignment_late',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 602,
        },
        fidModulo: 20,
      }, // 22
      {
        nombre: 'comunicaciones',
        url: '/comunicaciones',
        label: 'Comunicaciones',
        propiedades: {
          icono: 'notes',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 104,
        },
        fidModulo: 1,
      }, // 23
      {
        nombre: 'juridicoPendiente',
        url: '/juridico/pendientes',
        label: 'Bandeja de pendientes',
        propiedades: {
          icono: 'pending_actions',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 603,
        },
        fidModulo: 20,
      }, // 24
      {
        nombre: 'juridicoObservados',
        url: '/juridico/observados',
        label: 'Bandeja observados juridico',
        propiedades: {
          icono: 'assignment_late',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 604,
        },
        fidModulo: 20,
      }, // 25
      {
        nombre: 'juridicoConcluidos',
        url: '/juridico/concluidos',
        label: 'Bandeja concluidos',
        propiedades: {
          icono: 'approval',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 605,
        },
        fidModulo: 20,
      }, // 26
      {
        nombre: 'juridicoInscritos',
        url: '/juridico/inscritos',
        label: 'Bandeja inscritos',
        propiedades: {
          icono: 'check',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 606,
        },
        fidModulo: 20,
      }, // 27
      { // alertas empresas
        nombre: 'alertas',
        url: '/alertas',
        label: 'Alertas',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 105,
        },
        fidModulo: 1,
      }, // 28
      {
        nombre: 'publicacionesSolicitudes',
        url: '/publicaciones/solicitudes',
        label: 'Solicitudes',
        propiedades: {
          icono: 'content_paste',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 252,
        },
        fidModulo: 10,
      }, // 29
      {
        nombre: 'publicacionesPorPagar',
        url: '/publicaciones/porpagar',
        label: 'Por pagar',
        propiedades: {
          icono: 'pending_actions',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 253,
        },
        fidModulo: 10,
      }, // 30
      {
        nombre: 'publicacionesRealizadas',
        url: '/publicaciones/realizadas',
        label: 'Realizadas',
        propiedades: {
          icono: 'inventory',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 254,
        },
        fidModulo: 10,
      }, // 31
      {
        nombre: 'publicacionesBusquedas',
        url: '/publicaciones/busquedas',
        label: 'Búsqueda de publicaciones',
        propiedades: {
          icono: 'manage_search',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 255,
        },
        fidModulo: 10,
      }, // 32
      {
        nombre: 'publicacionesTarifas',
        url: '/publicaciones/tarifas',
        label: 'Tarifario',
        propiedades: {
          icono: 'attach_money',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 256,
        },
        fidModulo: 10,
      }, // 33
      {
        nombre: 'publicacionesManuales',
        url: '/publicaciones/manuales',
        label: 'Manual de usuario',
        propiedades: {
          icono: 'menu_book',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
          orden: 257,
        },
        fidModulo: 10,
      }, // 34
    ];
    const modulos = items.map((item) => {
      const m = new Modulo();
      // m.id = TextService.textToUuid(item.nombre);
      m.nombre = item.nombre;
      m.url = item.url;
      m.label = item.label;
      if (item.fidModulo) {
        const submodulo = new Modulo();
        submodulo.id = item.fidModulo;
        m.fidModulo = submodulo;
      }
      const propiedades = new PropiedadesDto();
      propiedades.color_dark = item.propiedades.color_dark;
      propiedades.color_light = item.propiedades.color_light;
      propiedades.icono = item.propiedades.icono;
      propiedades.orden = item.propiedades.orden;

      m.propiedades = propiedades;
      return m;
    });
    await queryRunner.manager.save(modulos);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
