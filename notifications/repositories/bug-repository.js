const Sequelize = require("sequelize");
const Op = Sequelize.Op
const Repository = require('./repository');
module.exports = class BugRepository {
  constructor() {}

  async upsert(bug) {
    try {
      return await Repository.Bug.upsert(bug, {
        where: {
          id: bug.id
        }
      })
    } catch (err) {
      throw new Error(`Could not save bug in db: Detail: ${err.message}`)
    }
  }

  async delete(bug) {
    try {
      return await Repository.Bug.destroy({
        where: {
          id: bug.id
        }
      })
    } catch (err) {
      throw new Error(
        `Could not delete bug from database. Detail: ${err.message}`)
    }
  }

  async getByUserIdAndSeverity(userId, severity, lastSend) {
    let query = {
      where: {
        userId: userId
        , severity: severity
        , stateId: 1
        , updatedAt: {
          [Op.gt]: lastSend
        }
      }
      , raw: true
    }
    try {
      let result = await Repository.Bug.findAll(query)
      return result
    } catch (err) {
      throw new Error(`Could not get bugs from the DB: ${err.message}`)
    }
  }

  async getUnresolvedBugsForUsers(users, numberOfDays) {
    const queryDate = new Date(new Date().setDate(new Date().getDate() -
      numberOfDays))
    let query = {
      where: {
        userId: {
          [Op.in]: users
        }
        , createdAt: {
          [Op.lte]: queryDate
        }
      }
      , raw: true
    }
    try {
      let result = await Repository.Bug.findAll(query)
      return result
    } catch (err) {
      throw new Error(`Could not get bugs from the DB: ${err.message}`)
    }
  }
}
