const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const LoginService = require('../services/login-service')

module.exports = class LoginController {
  constructor() {
    this.loginService = new LoginService()
  }

  login = async(req, res) => {
    const initTime = new Date().getTime()
    const credentials = req.body
    logger.debug("Arrived request to login with data: " + JSON.stringify(req.body), initTime)
    try {
      LoginService.validate(credentials)
      var authorization = await this.loginService.login(credentials)
    } catch (err) {
      logger.error(`Login attempt failed for user ${credentials.email}:` + err, initTime)
      return res.status(401).json({
        error: err.message
      })
    }
    logger.info(`Login attempt for user ${credentials.email} was successfull`, initTime)
    return res.status(200).json({
      authorization
    })
  }
}
