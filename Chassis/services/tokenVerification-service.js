// ver 1.1
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

const axios = require('axios').default
const authenticationServiceUri = process.env.AUTHENTICATION_SERVICE_URI

let storedTokens = {}

module.exports = class TokenVerificationService {
  constructor() {}

  static async verifyToken(token) {
    if (storedTokens[token] == undefined) {
      try {
        let result = await queryToken(token)
        storedTokens[token] = result
        logger.info(`Token ${token} verified correctly`)
        return result
      } catch (err) {
        logger.error(
          `Token verification from server failed. Reason: ${err.message}`
        )
        throw err
      }
    } else {
      logger.debug(`Verifying token from memory caché`)
      if (storedTokens[token].exp < Date.now() / 1000) {
        logger.error(`Token ${token} from caché is expired`)
        throw new Error(`Expired token`)
      } else
        return storedTokens[token]
    }
  }
}

async function queryToken(token) {
  let headers = {
    'Authorization': token
  }
  try {
    var response = await axios.get(
      authenticationServiceUri, {
        headers
      })
    if (response.status === 200) {
      return response.data
    }
  } catch (err) {
    var message = ''
    if (err.code === 'ECONNREFUSED') {
      message = `Token verification service is not reachable: ${err.message}`
    } else if (err.response.status === 401) {
      message = `Token invalid: ${err.response.data.message}`
    } else {
      message = `Unknown error verifying token ${err}`
    }
    throw new Error(message)
  }
}
