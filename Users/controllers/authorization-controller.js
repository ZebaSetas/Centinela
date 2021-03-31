const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const TokenService = require('../services/token-service')
module.exports = class LoginController {

  validate = async(req, res) => {
    const initTime = new Date().getTime()
    const token = req.headers['authorization']
    logger.debug("Arrived request to validate with token: " + JSON.stringify(
      token))
    try {
      var data = await TokenService.verifyToken(token)
      logger.debug("Token is valid", initTime)
      return res.status(200).json(data)
    } catch (err) {
      return res.status(401).json({
        error: 'Token is not valid'
      })
    }
  }

}
