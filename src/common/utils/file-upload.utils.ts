import { PreconditionFailedException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { extname } from 'path';
import { createHash } from 'crypto';

export const pdfFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf|PDF)$/)) {
    return callback(
      new PreconditionFailedException('Only pdf files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = nanoid();
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const sha256 = (base64) => {
  return createHash('sha256').update(base64).digest('hex');
};
