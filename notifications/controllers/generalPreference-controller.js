const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const GPreferenceService = require('../services/generalPreference-service')

module.exports = class PreferenceController {
  constructor() {
    this.gPreferenceService = new GPreferenceService()
  }

  saveGeneralPreference = async(req, res) => {
    const initTime = new Date().getTime()
    let preferenceRequest = req.body
    preferenceRequest.userId = req.userData.user.id
    preferenceRequest.userEmail = req.userData.user.email
    preferenceRequest.organizationId = req.userData.organizationId
    logger.debug(
      `Arrived request to save general preference with data: ${JSON.stringify(preferenceRequest)}`
      , initTime)
    try {
      GPreferenceService.validateGeneralPreference(preferenceRequest)
      var preferenceDB = await this.gPreferenceService
        .saveGeneralPreference(preferenceRequest)
    } catch (err) {
      logger.error(`Save preference failed: ${err.message}`, initTime)
      return res.status(400).json({
        error: err.message
      })
    }
    logger.info(
      `Preference saved/updated in the system. Id:${preferenceDB.id}`
      , initTime)
    return res.status(201).json(
      preferenceDB
    )
  }

  getGeneralPreference = async(req, res) => {
    const initTime = new Date().getTime()
    const user = req.userData.user
    logger.debug(
      `Arrived request to get general preference for user. DEBUG:" ${JSON.stringify(user)}`
      , initTime)
    try {
      var userPrefs = await this.gPreferenceService.getPreference(user.id)
    } catch (err) {
      logger.error(
        `Could not get general preference from the system. ${err.message}`
        , initTime)
      return res.status(400).json({
        error: err.message
      })
    }
    return res.status(201).json(userPrefs)
  }
}
