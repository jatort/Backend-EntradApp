# Backend-EntradApp

## Instalación:

### Development

Para el setup es necesario tener instalado Docker y Docker Comopose, con eso debería bastar para todo el proyecto.

#### Comandos:

1. `docker-compose build`
2. `docker-compose up`

Con esos 2 comandos debería funcionar, en el caso de que no se genere la carpeta `node_modules`, probar con el siguiente comando:

`docker-compose run --rm web npm install`

#### Testing:

Para correr los test de jest es necesario correr el comando:
`docker-compose run web npm test`

##### Otros comandos utiles

En el caso de instalar una dependencia para dev, que sea para utilizar `Typescript`:
`docker-compose run web npm install {dependencia} --save-dev`

En el caso de utilizar una dependencia para dev y producción, tal como _express_ o _mongoose_ se debe sacar el `--save-dev`.
