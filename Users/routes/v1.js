const config = require('config')
const pingRoutes = require('./v1/ping-routes')
const authorizationRoutes = require('./v1/authorization-routes')
const loginRoutes = require('./v1/login-routes')
const usersRoutes = require('./v1/users-routes')
const invitationRoutes = require('./v1/invitations-routes')

module.exports = (app) => {
  app.use(`/api/v1/${config.microservice_name}/ping`, pingRoutes)
  app.get(`/api/v1/${config.microservice_name}/info`, (req, res) => {
    res.send('Centinela Backend Microservice Users')
  })
  app.use('/api/v1/authorization', authorizationRoutes)
  app.use('/api/v1/users', usersRoutes)
  app.use('/api/v1/login', loginRoutes)
  app.use('/api/v1/invitations', invitationRoutes)

}
