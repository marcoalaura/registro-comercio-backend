/* eslint-disable max-lines-per-function */
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env ' });
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT;

// Cargando os CORS
app.use(
  cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Servicios Externos Fake SEPREC v1.0.0\n');
});

app.post('/fake/sin/VerificarNITEmpresaUnipersonal', (req, res) => {
  console.log(req.body);
  const NumeroDocumentoId = req.body.NumeroDocumentoId;
  const respuesta = {
    estado: '3',
    finalizado: false,
    mensaje: 'Error, no se logró procesar la solicitud',
    datos: {
      NIT: '',
      RazonSocial: '',
      Nombres: '',
      PrimerApellido: '',
      SegundoApellido: '',
      ApellidoCasada: '',
      EstadoNIT: '',
    },
  };
  const lastDigit = NumeroDocumentoId.slice(-1);
  // if (lastDigit && parseInt(lastDigit, 10) % 2 === 1) {}
  if (lastDigit === '0' || lastDigit === '1' || lastDigit === '2') {
    respuesta.finalizado = true;
    respuesta.estado = '1';
    respuesta.mensaje = 'Verificación parcial fonética satisfactoria';
    respuesta.datos = {
      NIT: NumeroDocumentoId + '015',
      RazonSocial: NumeroDocumentoId + '-empresa',
      Nombres: 'Nombre',
      PrimerApellido: 'Primer',
      SegundoApellido: 'Segundo',
      ApellidoCasada: '',
      EstadoNIT: '0',
    };
  } else if (lastDigit === '3' || lastDigit === '4' || lastDigit === '5') {
    respuesta.finalizado = true;
    respuesta.estado = '2';
    respuesta.mensaje = 'Error, los datos de entrada no coinciden con un registro del SIN';
    respuesta.datos.EstadoNIT = '1';
  } else if (lastDigit === '6' || lastDigit === '7') {
    respuesta.mensaje = 'Verificación completa satisfactoria';
    respuesta.estado = '0';
    respuesta.finalizado = true;
    respuesta.datos = {
      NIT: NumeroDocumentoId + '015',
      RazonSocial: NumeroDocumentoId + '-empresa',
      Nombres: 'Nombre',
      PrimerApellido: 'Primer',
      SegundoApellido: 'Segundo',
      ApellidoCasada: '',
      EstadoNIT: '0',
    };
  }
  // lastDigit === '8' o '9' implica estado 3, Error al procesar la solicitud

  res.send(respuesta);
});

app.post('/fake/sin/VerificarNITPersonaJuridica', (req, res) => {
  // console.log(req.body);
  const MatriculaComercio = req.body.MatriculaComercio;
  const NIT = req.body.NIT;
  const RazonSocial = req.body.RazonSocial;
  const respuesta = {
    estado: '5',
    finalizado: false,
    mensaje: 'Error, no se logró procesar la solicitud.',
    datos: {
      NIT,
      RazonSocial,
      EstadoNIT: '0',
    },
  };
  if (NIT) {
    const lastDigitNIT = NIT.slice(-1);
    if (lastDigitNIT === '0' || lastDigitNIT === '1') {
      respuesta.finalizado = true;
      respuesta.estado = '1';
      respuesta.mensaje = 'Verificación parcial fonética satisfactoria';
    } else if (lastDigitNIT === '2' || lastDigitNIT === '3') {
      respuesta.finalizado = true;
      respuesta.estado = '2';
      respuesta.mensaje = 'Error, el NIT y la Razón Social no coincide con un registro del SIN';
      respuesta.datos.EstadoNIT = '1';
    } else if (lastDigitNIT === '4' || lastDigitNIT === '5') {
      respuesta.finalizado = true;
      respuesta.estado = '3';
      respuesta.mensaje = 'Error, el NIT coincide y la Razón Social no coincide';
      respuesta.datos.EstadoNIT = '1';
    } else if (lastDigitNIT === '6' || lastDigitNIT === '7') {
      respuesta.finalizado = true;
      respuesta.estado = '4';
      respuesta.mensaje = 'Error, el NIT no coincide y la Razón Social si coincide';
      respuesta.datos.EstadoNIT = '1';
    } else if (lastDigitNIT === '8') {
      respuesta.finalizado = true;
      respuesta.estado = '0';
      respuesta.mensaje = 'Verificación completa satisfactoria';
      respuesta.datos.EstadoNIT = '0';
    }
    // lastDigitNIT === '9' implica estado 5, Error al procesar la solicitud
  } else {
    const lastDigitMat = MatriculaComercio.slice(-1);
    if (lastDigitMat && parseInt(lastDigitMat, 10) % 2 === 0) {
      respuesta.estado = '4';
      respuesta.finalizado = true;
      respuesta.mensaje = 'Error, el NIT no coincide y la Razón Social si coincide.';
      respuesta.datos.EstadoNIT = '1';
    }
  }
  res.send(respuesta);
});

app.post('/fake/sin/ReservarNITEmpresaUnipersonal', (req, res) => {
  const tipoDocumentoId = req.body.TipoDocumentoId;
  const numeroDocumentoId = req.body.NumeroDocumentoId;
  const nombres = req.body.Nombres;
  const primerApellido = req.body.PrimerApellido;
  const segundoApellido = req.body.SegundoApellido;

  const respuesta = {
    estado: '2',
    finalizado: false,
    mensaje: 'Error, no se logró procesar la solicitud',
    datos: {
      NITReservado: '',
    },
  };
  const lastDigit = numeroDocumentoId.slice(-1);
  if (
    lastDigit &&
    parseInt(lastDigit, 10) % 2 === 1 &&
    tipoDocumentoId &&
    nombres &&
    primerApellido &&
    segundoApellido
  ) {
    respuesta.estado = '0';
    respuesta.finalizado = true;
    respuesta.mensaje = 'Válido';
    const NITReservado = `${numeroDocumentoId}${123}`;
    respuesta.datos = {
      NITReservado,
    };
  }
  res.send(respuesta);
});

app.post('/fake/sin/ReservarNITPersonaJuridica', (req, res) => {
  const razonSocial = req.body.RazonSocial;
  console.log(razonSocial);
  // const numeroTestimonioConstitucion = req.body.numeroTestimonioConstitucion;

  const respuesta = {
    estado: '1',
    finalizado: false,
    mensaje: 'Inválido, no se pudo verificar',
    datos: {
      NITReservado: '',
    },
  };
  const randomizador = String(Math.floor(Math.random() * 10000000000)).slice(
    -1,
  );
  // const lastDigit = numeroTestimonioConstitucion.slice(-1);
  console.log(randomizador);
  console.log(razonSocial ? true : false);
  console.log(randomizador ? true : false);
  console.log(parseInt(randomizador, 10) % 2 === 1 ? true : false);
  if (razonSocial && randomizador && parseInt(randomizador, 10) % 2 === 1) {
    console.log('entra');
    respuesta.estado = '0';
    respuesta.finalizado = true;
    respuesta.mensaje = 'Válido';
    const NITReservado = `${Math.floor(Math.random() * 10000000000)}`;
    respuesta.datos = {
      NITReservado,
    };
  }
  res.send(respuesta);
});

const server = app.listen(port, () => {
  console.log(`
                                        ██
                                      ██
                                  ▒▒
                                ▒▒░░▒▒
                              ████  ░░▒▒  ████
                            ██  ▒▒░░▒▒
                          ██      ▒▒
                          ██          ██
                        ██████          ██
                        ██████
                    ██████████████
                  ██████████▒▒██████
                ██████████████▒▒▒▒████
                ████████████████▒▒▒▒██
                ██████████████████▒▒██
                ██▒▒██████████████▒▒██
                ██▒▒██████████████▒▒██
                ████▒▒██████████▒▒████
                  ████▒▒████████████
                    ██████████████
  `);
  console.log(`Servicios Fake para el SEPREC en http://localhost:${port}\n`);
});

module.exports = { app, server };
