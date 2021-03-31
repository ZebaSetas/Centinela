const config = require('config')
const pingRoutes = require('./v1/ping-routes')
const preferencesRoutes = require('./v1/preferences-routes')
module.exports = (app) => {

  app.use('/api/v1/preferences', preferencesRoutes)
  app.use(`/api/v1/${config.microservice_name}/ping`, pingRoutes)
  app.get(`/api/v1/${config.microservice_name}/info`, (req, res) => {
    res.send(`Centinela Microservice ${config.microservice_name}`)
  })
}
