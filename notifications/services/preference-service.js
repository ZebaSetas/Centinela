const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const Ajv = require('ajv')
const PreferenceRepository = require('../repositories/preference-repository')

const ajv = new Ajv()
const preferenceSchema = {
  "properties": {
    "isEnabled": {
      "type": "boolean"
    }
    , "isImmediate": {
      "type": "boolean"
    }
    , "timeHour": {
      "type": "integer"
      , "minimum": 0
      , "maximum": 23
    }
    , "timeMinute": {
      "type": "integer"
      , "minimum": 0
      , "maximum": 59
    }
    , "severity": {
      "type": "integer"
      , "minimum": 1
      , "maximum": 4
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
  , "required": ["isEnabled", "isImmediate", "timeHour", "timeMinute"
    , "severity", "userId", "userEmail"
  ]
}

module.exports = class PreferenceService {
  constructor() {
    this.preferenceRepository = new PreferenceRepository()
  }

  static validatePreference(preference) {
    const validate = ajv.compile(preferenceSchema)
    let valid = validate(preference)
    if (!valid)
      throw Error(
        `The format of provided invitation body is invalid: ${validate.errors[0].message}`
      )
    return true
  }

  async savePreference(pref) {
    try {
      //Must convert UTC hour to the server time first.
      var newPref = fromUTCtoServerTime(pref)
        //Check if that preference exists ( matches userid and severity)
      const updatedRow = await this.preferenceRepository.update(newPref
        , newPref.userId, newPref.severity)
      const updPref = updatedRow[1][0].dataValues
      logger.debug(
        `Preference updated in database. DEBUG:${JSON.stringify(updPref)}`
      )
      return toModel(updPref)
    } catch (err) {
      //Preference does not exists, must create a new one
      try {
        const preferenceDb = await this.preferenceRepository.create(
          toModel(newPref))
        logger.debug(
          `Preference created in database. DEBUG: ${JSON.stringify(preferenceDb)}`
        )
        return toModel(preferenceDb)
      } catch (err) {
        throw err
      }
    }
  }

  async getPreferencesToProcess(minuteWindow) {
    const dateTo = new Date()
    const dateFrom = new Date(Date.now() - (minuteWindow + 1) * 60 * 1000)
    const hour = dateTo.getHours()
    const minute = dateTo.getMinutes()
    const dataDb = await this.preferenceRepository
      .getEnabledByHourMinute(hour, minute - minuteWindow, minute)
    const lista = dataDb.map(function (x) {
      return toModel(x)
    })
    var returnList = []
    for (let index = 0; index < lista.length; index++) {
      const pref = lista[index];
      if (pref.lastSent == undefined || pref.lastSent < dateFrom) {
        returnList.push(pref)
      }
    }
    return returnList
  }

  async getImmediatePreferencesToProcess(user, severity) {
    const immediate = await this.preferenceRepository
      .getImmediateNotificationsByUserAndSeverity(user, severity)
    const lista = immediate.map(function (x) {
      return toModel(x)
    })
    return lista
  }

  async getPreferences(userId) {
    let prefs = await this.preferenceRepository.getByUserId(userId)
    return prefs.map(x => fromServerTimeToUTC(x)) //Must convert to UTC hours before sending

  }

  async updatePreference(newPref) {
    const updatedPref = await this.preferenceRepository.update(
      newPref
      , newPref.userId, newPref.severity)
    return updatedPref[1][0].dataValues
  }

}

function toModel(preference) {
  let result = {}
  if (preference.id)
    result.id = preference.id
  result.timeHour = preference.timeHour
  result.timeMinute = preference.timeMinute
  result.severity = preference.severity
  result.isImmediate = preference.isImmediate
  result.isEnabled = preference.isEnabled
  result.userId = preference.userId
  result.userEmail = preference.userEmail
  result.organizationId = preference.organizationId
  if (preference.lastSent)
    result.lastSent = preference.lastSent
  return result
}

function fromUTCtoServerTime(preference) {
  var date = new Date()
  date.setUTCHours(preference.timeHour)
  preference.timeHour = date.getHours()
  return preference
}

function fromServerTimeToUTC(preference) {
  var date = new Date()
  date.setHours(preference.timeHour)
  preference.timeHour = date.getUTCHours()
  return preference
}
