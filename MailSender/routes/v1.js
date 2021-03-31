const config = require('config')
const pingRoutes = require('./v1/ping-routes')

module.exports = (app) => {
  app.use(`/api/v1/${config.microservice_name}/ping`, pingRoutes)
  app.get(`/api/v1/${config.microservice_name}/info`, (req, res) => {
    res.send(`Centinela Microservice ${config.microservice_name}`)
  })
}
