import * as fs from 'fs';
import * as crypto from 'crypto';

export const checksumFile = (hashName: string, path: string) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(hashName);
    const stream = fs.createReadStream(path);
    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

export const checksumBuffer = (hashName: string, fileBuffer: Buffer) => {
  const hashSum = crypto.createHash(hashName);
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

export const getFileBase64 = (path: string) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path);
    const data = [];

    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => data.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(data).toString('base64')));
  });
};
