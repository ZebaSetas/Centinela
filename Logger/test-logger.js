const Logger = require('./centinela-logger')
var logger = new Logger(__filename)

logger.info(
  "**************** DEMO DEL LOGGER ***************************")
logger.info("Vamos a mostrar cómo se utilizaría la librería de log")
logger.info("Por más información, puede ir a ./logger/README.md")
var initTime = new Date().getTime()

logger.info('Soy un mensaje de información verde, ' +
  'al ingresar el tiempo inicial, yo solito calculo' +
  ' el tiempo final, y la diferencia', initTime)

var endTime = new Date().getTime()

logger.info('Soy un mensaje de información verde, ' +
  'al ingresar el tiempo inicial, yo solito calculo' +
  ' el tiempo final, y la diferencia', initTime, endTime)

logger.info(
  'Soy un mensaje de información verde con guid y no logueo datos temporales'
  , "xxxx-xxxx-xxxx")

logger.info('Soy un mensaje de información verde con guid, ' +
  'al ingresar el tiempo inicial, yo solito calculo' +
  ' el tiempo final, y la diferencia', initTime
  , "xxxx-xxxxx-xxxxx-xxx")

logger.info('Soy un mensaje de información verde con guid, ' +
  'al ingresar el tiempo inicial, yo solito calculo' +
  ' el tiempo final, y la diferencia', initTime, endTime
  , "xxxxx-xxxx-xxxx-xxxx")

logger.error(
  'Soy un mensaje de error rojo suave. Todos los tipos de mensaje pueden ir solitos, o con tiempo inicial o final'
)

logger.fatal(
  'Soy un mensaje de fatal rojo fuerte. Todos los tipos de mensaje pueden ir solitos, o con tiempo inicial o final'
)

logger.info(
  'Soy un mensaje de información verde y tampoco logueo tiempo')

logger.info('Soy un mensaje de información verde, ' +
  'al ingresar el tiempo inicial, yo solito calculo' +
  ' el tiempo final, y la diferencia', initTime)

logger.warn(
  'Soy un mensaje de aviso amarillo, al agregar tiempo inicial y final, calculo la diferencia en milisengudos'
  , initTime, endTime)

var endTime = new Date().getTime()

logger.warn(
  'Soy un mensaje de aviso amarillo, al agregar tiempo inicial y final, calculo la diferencia en milisengudos'
  , initTime, endTime, "guid-xxxxxxxxxxxxxxx")

logger.debug(
  "Soy un mensaje debug, y no sé cómo vas a hacer para verme")

throw new Error('this is an exception error')
