export const GetJsonData = function (query: string): any {
  const arrayOfKeyValues = query.split(',');
  const modifiedArray = [];
  for (let i = 0; i < arrayOfKeyValues.length; i++) {
    const arrayValues = arrayOfKeyValues[i].split(':');
    const arrayString =
      '"' + arrayValues[0] + '"' + ':' + '"' + arrayValues[1] + '"';
    modifiedArray.push(arrayString);
  }
  const jsonDataString = '{' + modifiedArray.toString() + '}';
  const jsonData = JSON.parse(jsonDataString);
  return jsonData;
};

export const GetOrderBy = function (order: string) {
  let data: any[];
  if (order.startsWith('-')) data = [order.substring(1), 'DESC'];
  else data = [order, 'ASC'];
  return {
    orden: data[0],
    ordenPor: data[1],
  };
};
