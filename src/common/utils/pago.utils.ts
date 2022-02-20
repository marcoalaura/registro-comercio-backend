import { randomBytes } from 'crypto';

export const genCodigoOrden = () => {
  const codigo = `${randomBytes(2).toString('hex')}-${randomBytes(2).toString(
    'hex',
  )}-${randomBytes(2).toString('hex')}`;
  return codigo.toUpperCase();
};
