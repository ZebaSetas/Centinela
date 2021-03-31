const Sequelize = require("sequelize");
const Op = Sequelize.Op
const Repository = require('./repository');
module.exports = class GeneralPreferenceRepository {
  constructor() {}

  async create(gPref) {
    try {
      return await Repository.GeneralPreference.create(gPref)
    } catch (err) {
      throw new Error(
        `Could not save general preference in db: ${err.name}:${err.errors[0].message} `
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
      let result = await Repository.GeneralPreference.findAll(query)
      if (!result)
        throw new Error(
          `There is no general preference for that user: ${userId}`)
      return result
    } catch (err) {
      throw new Error(
        `Could not get general preferences from the DB: ${err.message}`)
    }
  }

  async update(data, userId) {
    try {
      const updatedPref = await Repository.GeneralPreference.update(data, {
        where: {
          userId: userId
        }
        , returning: true
      })

      return updatedPref
    } catch (err) {
      const message =
        `Error in the database when updating general preference ${JSON.stringify(data)}: ${err.message}`
      throw new Error(message)
    }
  }

  async getAllEnalbledGeneralPreferences() {
    try {
      let query = {
        where: {
          isEnabled: true
        }
      }
      return await Repository.GeneralPreference.findAll(query)
    } catch (err) {
      const message =
        `Error in the database when querying for preferences: ${err.message}`
      throw new Error(message)
    }
  }

}
