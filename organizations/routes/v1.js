const config = require('config')
const pingRoutes = require('./v1/ping-routes')
const organizationRoutes = require('./v1/organizations-routes')
const systemRoutes = require('./v1/systems-routes')

module.exports = (app) => {
  app.use(`/api/v1/${config.microservice_name}/ping`, pingRoutes)
  app.get(`/api/v1/${config.microservice_name}/info`, (req, res) => {
    res.send(`Centinela Microservice ${config.microservice_name}`)
  })
  app.use('/api/v1/organizations', organizationRoutes)
  app.use('/api/v1/systems', systemRoutes)
}
