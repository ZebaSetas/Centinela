const Sequelize = require("sequelize");
const Op = Sequelize.Op
const Repository = require('../repositories/repository');
module.exports = class PreferenceRepository {
  constructor() {}

  async create(preference) {
    try {
      return await Repository.Preference.create(preference)
    } catch (err) {
      throw new Error(
        `Could not save preference in db: ${err.name}:${err.errors[0].message} `
      )
    }
  }

  async getByUserId(userId) {
    let query = {
      where: {
        userId: userId
      }
    }
    try {
      let result = await Repository.Preference.findAll(query)
      if (!result)
        throw new Error(
          `There is no preference for that user: ${userId}`)
      return result
    } catch (err) {
      throw new Error(
        `Could not get preferences from the DB: ${err.message}`)
    }
  }
  async getByUserIdAndSeverity(userId, severity) {
    let query = {
      where: {
        userId: userId
        , severity: severity
      }
    }
    try {
      let result = await Repository.Preference.findAll(query)
      if (!result)
        throw new Error(
          `There is no preference for that user: ${userId} with severity ${severity}`
        )
      return result
    } catch (err) {
      throw new Error(
        `Could not get preferences from the DB: ${err.message}`)
    }
  }

  async update(data, userId, severity) {
    try {
      const updatedPref = await Repository.Preference.update(data, {
        where: {
          userId: userId
          , severity: severity
        }
        , returning: true
      })

      return updatedPref
    } catch (err) {
      const message =
        `Error in the database when updating an preference ${JSON.stringify(data)}: ${err.message}`
      throw new Error(message)
    }
  }

  async getEnabledByHourMinute(hour, minuteMin, minuteMax) {
    try {
      let query = {
        where: {
          [Op.and]: [{
            timeHour: hour
          }, {
            timeMinute: {
              [Op.between]: [minuteMin, minuteMax]
            }
          }, {
            isEnabled: true
          }]
        }
      }
      return await Repository.Preference.findAll(query)
    } catch (err) {
      const message =
        `Error in the database when querying for preferences: ${err.message}`
      throw new Error(message)
    }
  }
  async getImmediateNotificationsByUserAndSeverity(userId, severity) {
    try {
      let query = {
        where: {
          isImmediate: true
          , isEnabled: true
          , userId: userId
          , severity: severity
        }
      }
      return await Repository.Preference.findAll(query)
    } catch (err) {
      const message =
        `Error in the database when querying for preferences: ${err.message}`
      throw new Error(message)
    }
  }

}
