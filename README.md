# Backend-EntradApp

## Instalación:

### Development

Para el setup es necesario tener instalado Docker y Docker Comopose, con eso debería bastar para todo el proyecto.

#### Comandos:
1. `docker-compose -f docker-compose.dev.yml build`
2. `docker-compose -f docker-compose.dev.yml up`

Con esos 2 comandos debería funcionar, en el caso de que no se genere la carpeta `node_modules`, probar con el siguiente comando:

`docker-compose -f docker-compose.dev.yml run --rm web npm install`

##### Otros comandos utiles

En el caso de instalar una dependencia para dev, que sea para utilizar `Typescript`:
`docker-compose run web npm install {dependencia} --save-dev`

En el caso de utilizar una dependencia para dev y producción, tal como *express* o *mongoose* se debe sacar el `--save-dev`.
