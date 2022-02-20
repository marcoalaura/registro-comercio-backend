export const verificarEstadoMatricula = (
  estado: string,
  actualizacion: string,
) => {
  // '0': Matrícula no actualizada
  // '1': Matrícula actualizada
  // '2': Matrícula cancelada
  let ctrlEstado: string;
  if (estado === 'CANCELADO') {
    ctrlEstado = '2';
  } else if (actualizacion === '1') {
    ctrlEstado = '0';
  } else {
    ctrlEstado = '1';
  }
  return ctrlEstado;
};
