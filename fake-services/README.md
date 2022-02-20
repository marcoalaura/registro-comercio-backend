# SERVICIOS FAKE SEPREC
Este proyecto es para levantar **Servicios Fake** que serán usados dentro del sistema **SEPREC**.

## Requisitos
- Nodejs v16.13.1

## Instalación y ejecución del sistema
Ingresar al directorio **fake-services**
```bash
cd fake-services
```
Crear el archivos de configuración **.env**, el puerto de ejecución es el 8080, puede cambiarlo dentro de este archivo de configuración.
```bash
cp .env.sample .env
```
Instalar dependencias
```bash
npm install
```
Ejecutar el compilador de TypeScript
```bash
npm run build
```

Ejecutar el compilador de TypeScript
```bash
npm run start
```

## Servicios fake SIN

### **Verificación NIT empresa unipersonal (persona natural)**
Ejemplo petición 
```bash
curl --location --request POST 'http://localhost:9000/fake/sin/VerificarNITEmpresaUnipersonal' \
--header 'Content-Type: application/json' \
--data-raw '{
    "TipoDocumentoId": "CI",
    "NumeroDocumentoId": "6098567",
    "Complemento": "1D",
    "PrimerApellido": "Apellido"
}'
```
Ejemplo respuesta
```bash
{
    "estado": "0",
    "finalizado": true,
    "mensaje": "Válido",
    "datos": {
        "NIT": "6098567015",
        "RazonSocial": "6098567-empresa",
        "Nombres": "Nombres",
        "PrimerApellido": "PrimerApellido",
        "SegundoApellido": "SegundoApellido",
        "ApellidoCasada": "ApellidoCasada",
        "EstadoNIT": "0"
    }
}
```

### **Verificación NIT persona Jurídica**
Ejemplo petición
```bash
curl --location --request POST 'http://localhost:9000/fake/sin/VerificarNITPersonaJuridica' \
--header 'Content-Type: application/json' \
--data-raw '{
    "MatriculaComercio":"1112132131",
    "NIT":"123123123",
    "RazonSocial": "razon social"
}'
```
Ejemplo respuesta
```bash
{
    "estado": "0",
    "finalizado": true,
    "mensaje": "Válido",
    "datos": {
        "NIT": "123123123",
        "RazonSocial": "razon social",
        "EstadoNIT": "0"
    }
}
```

### **Reserva NIT empresa unipersonal (persona Natural)**
Ejemplo petición
```bash
curl --location --request POST 'http://localhost:9000/fake/sin/ReservarNITEmpresaUnipersonal' \
--header 'Content-Type: application/json' \
--data-raw '{
  "TipoDocumentoId":"2",
  "NumeroDocumentoId":"5435353",
  "Nombres":"Juan",
  "PrimerApellido":"Pablo",
  "SegundoApellido":"Ramos"
}'
```
Ejemplo respuesta
```bash
{
    "estado": "0",
    "finalizado": true,
    "mensaje": "Válido",
    "datos": {
        "NITReservado": "5435353123"
    }
}
```

### **Reserva NIT persona Juridica**
Ejemplo petición 
```bash
curl --location --request POST 'http://localhost:9000/fake/sin/ReservarNITPersonaJuridica' \
--header 'Content-Type: application/json' \
--data-raw '{
    "RazonSocial": "razon social"
}'
```
Ejemplo respuesta
```bash
{
    "estado": "0",
    "finalizado": true,
    "mensaje": "Válido",
    "datos": {
        "NITReservado": "1902951542"
    }
}
```
