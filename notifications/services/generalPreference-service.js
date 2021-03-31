const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const Ajv = require('ajv')
const GPreferenceRepository = require(
  '../repositories/generalPreference-repository')

const ajv = new Ajv()
const preferenceSchema = {
  "properties": {
    "isEnabled": {
      "type": "boolean"
    }
    , "userId": {
      "type": "integer"
    }
    , "userEmail": {
      "type": "string"
      , "format": "email"
    }
  }
  , "additionalProperties": true
  , "required": ["isEnabled", "userId", "userEmail"]
}

module.exports = class PreferenceService {
  constructor() {
    this.gPreferenceRepository = new GPreferenceRepository()
  }

  static validateGeneralPreference(preference) {
    const validate = ajv.compile(preferenceSchema)
    let valid = validate(preference)
    if (!valid)
      throw Error(
        `The format of provided preference body is invalid: ${validate.errors[0].message}`
      )
    return true
  }

  async saveGeneralPreference(newPref) {
    try {
      //Check if that preference exists ( matches userid )
      const updatedRow = await this.gPreferenceRepository
        .update(newPref, newPref.userId)
      const updPref = updatedRow[1][0].dataValues
      logger.debug(
        `General preference updated in database. DEBUG:${JSON.stringify(updPref)}`
      )
      return toModel(updPref)
    } catch (err) {
      //Preference does not exists, must create a new one
      try {
        const preferenceDb = await this.gPreferenceRepository.create(
          toModel(newPref))
        logger.debug(
          `General preference created in database. DEBUG: ${JSON.stringify(preferenceDb)}`
        )
        return toModel(preferenceDb)
      } catch (err) {
        throw err
      }
    }
  }

  async getGeneralPreferencesToProcess() {
    const prefs = await this.gPreferenceRepository
      .getAllEnalbledGeneralPreferences()
    const lista = prefs.map(function (x) {
      return toModel(x)
    })
    return lista
  }

  async getPreference(userId) {
    return await this.gPreferenceRepository.getByUserId(userId)
  }

  async updatePreference(newPref) {
    const updatedPref = await this.gPreferenceRepository.update(
      newPref
      , newPref.userId, newPref.severity)
    return updatedPref[1][0].dataValues
  }

}

function toModel(preference) {
  let result = {}
  if (preference.id)
    result.id = preference.id
  result.isEnabled = preference.isEnabled
  result.userId = preference.userId
  result.userEmail = preference.userEmail
  result.organizationId = preference.organizationId
  if (preference.lastSent)
    result.lastSent = preference.lastSent
  return result
}
