import { genCodigoOrden } from './pago.utils';

describe('Pago Utils', () => {

  it('[genCodigoOrden] deberia generar un código de orden de 14 caracteres', async () => {
    const codigo = genCodigoOrden();
    expect(codigo).toBeDefined();
    expect(codigo.length).toEqual(14)
  });

  it('[genCodigoOrden] deberia generar 2 códigos de orden de 14 caracteres diferentes', async () => {
    const c1 = genCodigoOrden();
    const c2 = genCodigoOrden();
    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
    expect(c1).not.toEqual(c2);
  });

  it('[genCodigoOrden] deberia generar 1000 codigos de orden y no tener repetidos', async () => {
    const codigos = [];
    for (let i = 0; i < 1000; i++) {
      codigos.push(genCodigoOrden());
    }
    // new Set(array), esto hace un nuevo Set de elementos, que no están repetidos.
    const length1 = new Set(codigos).size;
    const repetidos = length1 === codigos.length;
    expect(length1).toBeDefined();
    expect(repetidos).toBeDefined();
    expect(codigos.length).toEqual(1000);
    expect(repetidos).toEqual(true);
  });

  it('[genCodigoOrden] deberia generar 10000 codigos de orden y no tener repetidos', async () => {
    const codigos = [];
    for (let i = 0; i < 10000; i++) {
      codigos.push(genCodigoOrden());
    }
    // new Set(array), esto hace un nuevo Set de elementos, que no están repetidos.
    const length1 = new Set(codigos).size;
    const repetidos = length1 === codigos.length;
    expect(length1).toBeDefined();
    expect(repetidos).toBeDefined();
    expect(codigos.length).toEqual(10000);
    expect(repetidos).toEqual(true);
  });
});