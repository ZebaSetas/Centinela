const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const PreferenceService = require('../services/preference-service')

module.exports = class PreferenceController {
  constructor() {
    this.preferenceService = new PreferenceService()
  }

  savePreference = async(req, res) => {
    const initTime = new Date().getTime()
    let preferenceRequest = req.body
    preferenceRequest.userId = req.userData.user.id
    preferenceRequest.userEmail = req.userData.user.email
    preferenceRequest.organizationId = req.userData.organizationId
    logger.debug(
      `Arrived request to save preference with data: ${JSON.stringify(preferenceRequest)}`
      , initTime)
    try {
      PreferenceService.validatePreference(preferenceRequest)
      var preferenceDB = await this.preferenceService.savePreference(
        preferenceRequest)
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

  getPreferences = async(req, res) => {
    const initTime = new Date().getTime()
    const user = req.userData.user
    logger.debug(
      `Arrived request to get all preferences for user. DEBUG:" ${JSON.stringify(user)}`
      , initTime)
    try {
      var userPrefs = await this.preferenceService.getPreferences(user.id)
    } catch (err) {
      logger.error(
        `Could not get preferences from the system. ${err.message}`
        , initTime)
      return res.status(400).json({
        error: err.message
      })
    }
    return res.status(201).json(userPrefs)
  }
}
