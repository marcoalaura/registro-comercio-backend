const textoUnidades = {
  1: 'un',
  2: 'dos',
  3: 'tres',
  4: 'cuatro',
  5: 'cinco',
  6: 'seis',
  7: 'siete',
  8: 'ocho',
  9: 'nueve',
};

const textoDecenaDiez = {
  0: 'diez',
  1: 'once',
  2: 'doce',
  3: 'trece',
  4: 'catorce',
  5: 'quince',
};

const textoDecenas = {
  1: 'diez',
  2: 'veinte',
  3: 'treinta',
  4: 'cuarenta',
  5: 'cincuenta',
  6: 'sesenta',
  7: 'setenta',
  8: 'ochenta',
  9: 'noventa',
};

const textoCentenas = {
  1: 'cien',
  2: 'doscientos ',
  3: 'trescientos ',
  4: 'cuatrocientos ',
  5: 'quinientos ',
  6: 'seiscientos ',
  7: 'setecientos ',
  8: 'ochocientos ',
  9: 'novecientos ',
};

export class ConverterService {
  static unidades(numero) {
    return textoUnidades[numero] || '';
  }

  static decenasY(strSin, numUnidades) {
    return numUnidades > 0
      ? `${strSin} y ${this.unidades(numUnidades)}`
      : strSin;
  }

  static convertirDecenas(numero) {
    const decena = Math.floor(numero / 10);
    const unidad = numero - decena * 10;

    if (decena == 1) {
      return unidad > 5
        ? `dieci${this.unidades(unidad)}`
        : textoDecenaDiez[unidad];
    }

    if (decena == 2) {
      return unidad > 0
        ? `veinti${this.unidades(unidad)}`
        : textoDecenas[decena];
    }

    return decena == 0
      ? this.unidades(unidad)
      : this.decenasY(textoDecenas[decena], unidad);
  }

  static convertirCentenas(numero) {
    const centenas = Math.floor(numero / 100);
    const decenas = numero - centenas * 100;

    if (centenas == 1) {
      return decenas > 0
        ? `ciento ${this.convertirDecenas(decenas)}`
        : textoCentenas[centenas];
    } else if (textoCentenas[centenas]) {
      return textoCentenas[centenas] + this.convertirDecenas(decenas);
    }

    return this.convertirDecenas(decenas);
  }

  static convertirSeccion(numero, divisor, [strSingular, strPlural]) {
    const cientos = Math.floor(numero / divisor);
    const resto = numero - cientos * divisor;

    let letras = '';

    if (cientos > 0)
      if (cientos > 1)
        letras = `${this.convertirCentenas(cientos)} ${strPlural}`;
      else letras = strSingular;

    if (resto > 0) letras += '';

    return letras;
  }

  static convertirMiles(numero) {
    const divisor = 1000;
    const cientos = Math.floor(numero / divisor);
    const resto = numero - cientos * divisor;

    const strMiles = this.convertirSeccion(numero, divisor, ['un mil', 'mil']);
    const strCentenas = this.convertirCentenas(resto);

    return strMiles == '' ? strCentenas : `${strMiles} ${strCentenas}`;
  }

  static convertirMillones(numero) {
    const divisor = 1000000;
    const cientos = Math.floor(numero / divisor);
    const resto = numero - cientos * divisor;

    const strMillones = this.convertirSeccion(numero, divisor, [
      'un millon',
      'millones',
    ]);
    const strMiles = this.convertirMiles(resto);

    return strMillones == '' ? strMiles : `${strMillones} ${strMiles}`;
  }

  static convertirCentavos(centavos) {
    return centavos.toString() + '/100';
  }

  static numerosALetras(numero, textoMonedaSingular, textoMonedaPlural?) {
    textoMonedaPlural = textoMonedaPlural || `${textoMonedaSingular}s`;
    const datos = {
      numero,
      enteros: Math.floor(numero),
      centavos: Math.round(numero * 100) - Math.floor(numero) * 100,
      textoCentavo: ' 00/100',
    };

    if (datos.centavos > 0) {
      datos.textoCentavo = ' ' + this.convertirCentavos(datos.centavos);
    }

    if (datos.enteros == 0)
      return `cero  ${textoMonedaPlural} ${datos.textoCentavo}`;

    let resultado = `${this.convertirMillones(datos.enteros)}${
      datos.textoCentavo
    }`;
    resultado =
      datos.enteros == 1
        ? `${resultado} ${textoMonedaSingular}`
        : `${resultado} ${textoMonedaPlural}`;
    return this.primeraLetraMayuscula(resultado);
  }

  static primeraLetraMayuscula(cadena) {
    return cadena
      .charAt(0)
      .toUpperCase()
      .concat(cadena.substring(1, cadena.length));
  }
}
