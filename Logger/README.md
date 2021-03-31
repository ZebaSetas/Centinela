# Centinela Logger for NodeJS
## Larrosa-Settimo-Zawrzykraj  

### Introduccion

Ésta es una librería personalizada de logging basada en winston.

Es una librería minimal, toma solo algunas de las funcionalidades que presenta winston, y permite realizar un guardado de log tanto en consola, en un archivo de texto a la vez como tambien publicar en un servidor de syslog. Con el siguiente formato de ejemplo:

`[fecha][numero de proceso][nivel del log][archivo que generó el log][tiempo en milisegundos (opcional)] >>> mensaje`

##### Ejemplos

```[2020-06-07 12:53:22][30284][info][../Logger/index.js] >>> Mensaje de información
[2020-06-07 12:53:22][30284][debug][../Logger/index.js][5ms] >>> Mensaje debug
[2020-06-07 12:53:22][30284][warn][../Logger/index.js][0ms] >>> Mensaje de alerta
[2020-06-07 12:53:22][30284][error][../Logger/index.js] >>> Mensaje de error
```

###Configuracion

Se puede configurar para que en el ambiente local guarde los logs en dos archivos: exception.log y server.log
Basicamente en el env debe colocar estas variables de entorno, e indicar en el enviroment que está en un ambiente local:

Si el `LOG_ENVIRONMENT` es `local`, crea una carpeta para los logs en un archivo, y en consola  
Si el `LOG_ENVIRONMENT` es `cloud`, envia los logs utiliando syslog a un servicio cloud `LOG_CLOUD_LOGGING_HOST` y `LOG_CLOUD_LOGGING_PORT` y a consola  
Si el `LOG_ENVIRONMENT` es `both`, genera los logs en consola, localmente y en la nube  
Si el `LOG_ENVIRONMENT` es `console`, solo genera los logs en consola.  
Log levels ( error | warn | info | verbose | debug )   

```
LOG_LEVEL= ( debug | info | warn | error | crit )
LOG_ENVIRONMENT= (local | cloud | console | both )
LOG_LOCAL_FOLDER= (log folder location )
LOG_LOCAL_FILE_NAME=( logs filename )
LOG_LOCAL_EXCEPTION_FILE_NAME=( exceptions filename )
LOG_CLOUD_LOGGING_HOST= ( syslog server url )
LOG_CLOUD_LOGGING_PORT= (syslog server port )
```


###Uso

Para importarla debe hacer lo siguiente:

`var Logger = require('logger')`

Luego debe crear una instancia, en cada archivo donde necesite loggear. Puede hacerlo indicando o no la ruta destino del log:

``var logger = new Logger(__filename)``

Obs: en el primer argumento, debe siempre agregar **__filename**, que es la url global del script (archivo) donde estamos creando la librería. Esto nos permite loguear indicando el nombre del archivo que se encuentra logueando.

****Estos son los tipos de mensaje que puede loggear, con niveles INFO, DEBUG, WARN y ERROR:****

```
logger.info('Mensaje info sin calculo de tiempo')
logger.warn('Mensaje warn sin calculo de tiempo')
logger.error('Mensaje error sin calculo de tiempo')
logger.debug('Mensaje debug sin calculo de tiempo')
```

También puede agregar un tiempo de inicio, y el logger calculrá el tiempo final, y la diferencia en milisegundos:

`var initTime = new Date().getTime()`

```
logger.warn('Mensaje warn sin calculo de tiempo',initTime)
logger.error('Mensaje error sin calculo de tiempo',initTime)
logger.debug('Mensaje debug sin calculo de tiempo',initTime)
```

**Por último también podrá agregar un tiempo final, y el logger calculará la diferencia en milisegundos:**

`var endTime = new Date().getTime()`

```
logger.info('Mensaje info sin calculo de tiempo',initTime,endTime)
logger.warn('Mensaje warn sin calculo de tiempo',initTime,endTime)
logger.error('Mensaje error sin calculo de tiempo',initTime,endTime)
logger.debug('Mensaje debug sin calculo de tiempo',initTime,endTime)
```



**Agregación de guid opcional**

Si lo desea pueda agregar un guid al final de cada logueo (siempre como último parámetro):

`logger.info("Bug created", initTime, guid)`

Y esto generaría la siguiente línea de log:




**Lectura del log y excepciones no capturadas**

Como indicamos anteriormente, el log se guarda por defecto en la carpeta ./log.

En la misma se guardarán dos archivos: server.log y exception.log.

En el primer archivo accederá al log completo, el cual puede leer en caliente con el comando:

`tail -f server.log`

Este comando deberá ejecutarse parado en la misma carpeta donde se encuentra el log. Le permitirá ver los cambios del log a medida que se vayan sucediendo, sin tener que refrescar ni volver a ejecutar el comando.

Por otro lado, en el archivo excpetion.log caerán todas las excepciones no manejadas (puede probar hacer un `throw Error('error')` y verá el resultado.
