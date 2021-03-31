require('dotenv').config()
require('newrelic')
const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT
const Repository = require('./repositories/repository')
const exposeRoutes = require('./routes/v1')
const app = express()
const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const httpContext = require('express-http-context');
const {
  v4: uuidv4
} = require('uuid')

var options = {
  explorer: true
}

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument
  , options));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(httpContext.middleware);
app.use(function (req, res, next) {
  var transactionId = req.headers['transaction-id']
  if (transactionId) httpContext.set('Transaction-ID', transactionId)
  else httpContext.set('Transaction-ID', uuidv4())
  var auth = httpContext.get('Authorization')
  if (auth) httpContext.set('Authorization', auth)
  next();
});

var webServer
app.use(cors());
(async() => {
  try {
    await Repository.initRepository()
    webServer = app.listen(port, function () {
      logger.info(`Centinela ${config.microservice_name} running on port ${port}`)
      setTerminalTitle(config.microservice_name);
    })
  } catch (err) {
    logger.error(`Failed to start server: ${err}`)
    process.exit(1)
  }
})()

exposeRoutes(app)

function setTerminalTitle(title) {
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

process.on("SIGINT", function () {
  logger.info('Closing application');
  webServer.close();
  process.exit(0);
});
