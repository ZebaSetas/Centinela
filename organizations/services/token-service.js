const jwt = require('jsonwebtoken')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

const envSecret = process.env.ENVIRONMENT_SECRET

module.exports = class TokenService {
  constructor() {}

  static newNonExpiringToken(data) {
    const metadata = {
      data: data
    }
    return generateToken(metadata)
  }

  static verifyToken(token) {
    try {
      logger.debug(`Token verification for token: ${token} initiated`)
      let result = jwt.verify(token, envSecret)
      logger.debug(`Token verification for token: ${token} completed`)
      return result
    } catch (err) {
      throw new Error(`Error verifying token ${err.message}`)
    }
  }
}

generateToken = (metadata) => {
  try {
    logger.debug(
      `Initiating token request with data: ${JSON.stringify(metadata.data)}`
    )
    let token = jwt.sign(metadata, envSecret)
    logger.debug(
      `Done creating token request with data: ${JSON.stringify(metadata.data)}`
    )

    return token
  } catch (err) {
    let errorMessage = `Token creation failed with error ${err.message}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}
