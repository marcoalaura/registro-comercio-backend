import { PlantillaTramite as p } from 'src/common/constants/plantillas';
export class PlantillaTramite {
  static tramiteHTML(datos: any) {
    let body = `
      <body>
       <div ${this.estilo(p.codigo.size, p.codigo.color)}>
          <b>Código de Trámite ${datos.codigo === null ? '' : datos.codigo}</b>
        </div>
        <div ${this.estilo(p.tituloTramite.size, p.tituloTramite.color)}>
          <b>${datos.nombreTramite === null ? '' : datos.nombreTramite}</b>
        </div>
      `;
    datos.grupos.forEach((grupo) => {
      if (!grupo.aprobacionDocumentos && !grupo.pago) {
        body += `
          <br>
          <div ${this.estilo(p.grupo.size, p.grupo.color)}>
            <b>${grupo.orden}. ${grupo.nombre}</b>
          </div><hr>
        `;
        grupo.secciones.forEach((seccion, index) => {
          if (index !== 0) body += '<br>';
          body += `
            <div ${this.estilo(p.seccion.size, p.seccion.color)}>
              <b>${grupo.orden}.${seccion.orden}. ${seccion.nombre}</b>
            </div>
          `;
          body += `<table data-pdfmake="{'layout':'noBorders'}"><tr><td></td>`;
          let size = 12;
          seccion.campos.forEach((campo) => {
            if (size + campo.size > 12) {
              body += '</tr></table>';
              body += `<table data-pdfmake="{'layout':'noBorders'}"><tr><td width="1%"></td>`;
              size = 0;
            }
            body += `
            <td width=${campo.size * 8.25}%>
              <div ${this.estilo(p.campo.size, p.campo.color)}>
                <b>${campo.label === null ? '' : campo.label}</b>
                <br><div>
                ${campo.valor === null ? '' : campo.valor}</div>
              </div>
            </td> `;
            size += campo.size;
          });
          body += '</tr></table>';
        });
      }
    });
    body += '</body>';
    return body;
  }

  static estilo(size: string, color: string) {
    return `style="font-size:${size}; color:${color};"`;
  }
}
