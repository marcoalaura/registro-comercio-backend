export class ResponseWrapper {
  ok(elementoRaiz: string, datos: any) {
    return {
      [elementoRaiz]: {
        CtrlResult: 'D-EXIST',
        ...datos,
      },
    };
  }

  badRequest(elementoRaiz: string) {
    return {
      [elementoRaiz]: {
        CtrlResult: 'U-000',
      },
    };
  }

  notFound(elementoRaiz: string, identificador: string) {
    return {
      [elementoRaiz]: {
        CtrlResult: `E-${identificador}-001`,
      },
    };
  }

  forbidden() {
    return '403';
  }

  preConditionFailed() {
    return '412';
  }

  internalServerError() {
    return '500';
  }

  nestedExistElements(
    elementoRaiz: string,
    elementoAdicional: string,
    datos: any,
  ) {
    const result = [];
    for (const index in datos.result) {
      result.push({
        [elementoAdicional]: {
          CtrlResult: 'D-EXIST',
          ...datos.result[index],
        },
      });
    }
    return { [elementoRaiz]: result };
  }

  nestedNotFoundElements(
    elementoRaiz: string,
    elementoAdicional: string,
    identificador: any,
  ) {
    if (elementoRaiz) {
      return {
        [elementoRaiz]: {
          [elementoAdicional]: {
            CtrlResult: `E-${identificador}-001`,
          },
        },
      };
    }
    return {
      [elementoAdicional]: {
        CtrlResult: `E-${identificador}-001`,
      },
    };
  }

  rootElementWrapper(elementoRaiz: string, datos: any) {
    return {
      [elementoRaiz]: {
        ...datos,
      },
    };
  }

  nullValuesFinder(objeto: any) {
    let esValido = true;
    for (const o in objeto) {
      if (objeto[o] === null || objeto[o] === '') {
        return (esValido = false);
      }
    }
    return esValido;
  }
}
