export const removeAll = function (
  elements: Array<any>,
  list: Array<any>,
): Array<any> {
  for (let i = 0, l = elements.length; i < l; i++) {
    let ind: number;
    while ((ind = list.indexOf(elements[i])) > -1) {
      list.splice(ind, 1);
    }
  }
  return list;
};

export const uniqueElements = function (arr: Array<any>) {
  return new Set(arr).size;
};

/**
 * Metodo para verificar si un array es subconjunto de otro
 * @param a conjunto de elemento principal
 * @param b sub conjunto de elementos
 * @returns true si b esta contenido en a
 */
export const isSubArray = function (a: Array<any>, b: Array<any>) {
  let result = true;
  b.forEach((n) => {
    if (!a.includes(n)) {
      result = false;
      return;
    }
  });
  return result;
};

export const removeItem = function (arr: Array<any>, item: any) {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i !== -1) {
    arr.splice(i, 1);
  }
};

export const getKeysFromArrayObject = (arr: Array<any>, key: string) => {
  const result = [];
  arr.map((item) => {
    result.push(item[key]);
  });
  return result;
};

export const getItemFromArrayObject = (arr: Array<any>, key: string) => {
  const result = arr.filter((item) => item.campo === key);
  return result?.length > 0 ? result[0] : null;
};
