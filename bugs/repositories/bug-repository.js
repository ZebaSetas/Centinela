const Repository = require('../repositories/repository')
const config = require('config')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class BugRepository {
  constructor() {}

  async findAll(limit, offset, state, order, organizationId) {
    var query = {
      include: ["state", "system", "environment", "user"]
    }
    if (order) {
      if (order === config.queryparams.order.severity_asc) {
        query.order = [
          ['severity', 'ASC']
          , ['id', 'ASC']
        , ]
      } else if (order === config.queryparams.order.severity_desc) {
        query.order = [
          ['severity', 'DESC']
          , ['id', 'ASC']
        ]
      } else {
        throw Error('Query param order=' + order + ' is not valid')
      }
    }
    if (limit) {
      query.limit = limit
    }
    if (offset) {
      query.offset = offset
    }
    if (state) {
      if (state === config.queryparams.state.pendig) {
        query.where = {
          stateId: config.state.pending_id
          , organizationId: organizationId
        }
      } else if (state === config.queryparams.state.completed) {
        query.where = {
          stateId: config.state.completed_id
          , organizationId: organizationId
        }
      } else {
        throw Error('Query param state=' + state + ' is not valid')
      }
    } else {
      query.where = {
        organizationId: organizationId
      }
    }
    let bugs = await Repository.Bug.findAll(query)
    return bugs
  }

  async create(bug) {
    return Repository.Bug.create(bug).then((bug) => {
      logger.debug('Bug created OK in BD with data: ' + JSON.stringify(
        bug))
      return bug
    }).catch((err) => {
      logger.error('Error in the database when creating Bug: ' + JSON.stringify(
        bug) + ' - ' + err)
      throw new Error('Error in the database when creating Bug')
    });
  }

  async update(bugBd) {
    try {
      await bugBd.save()
      logger.debug('Bug updated OK in database with data: ' + JSON.stringify(
        bugBd))
      return await this.findById(bugBd.id)
    } catch (err) {
      logger.error('Error in the database when updating Bug: ' +
        JSON.stringify(bugBd) + ': ' + err)
      throw new Error('Error in the database when updating Bug')
    }
  }

  async findById(bugId) {
    try {
      let bug = await Repository.Bug.findOne({
        where: {
          id: bugId
        }
        , include: ["state", "environment", "user", "system"
          , "organization"
        ]
      })
      return bug
    } catch (err) {
      logger.error('Cant find bug in BD with id ' + bugId + ': ' + err)
      throw Error('Cant find bug in BD with id ' + bugId)
    }
  }

  async queryReport(query) {
    try {
      return Repository.Bug.findAll(query)
    } catch {
      throw new Error('Error in the database when querying a Report')
    }
  }

}
