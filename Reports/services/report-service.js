const config = require('config')
const Logger = require('centinela-logger')
const BugRepository = require('../repositories/bug-repository')
const OrganizationRepository = require(
  '../repositories/organization-repository')
var logger = new Logger(__filename)
const Repository = require('../repositories/repository')
const {
  Op
  , fn
  , col
} = require('sequelize')

module.exports = class ReportService {
  constructor() {
    this.bugRepository = new BugRepository()
    this.organizationRepository = new OrganizationRepository()
  }

  async criticalBugsOfOrganization(organizationId) {
    try {
      let organizationInBd = await this.organizationRepository.findByForeignId(
        organizationId)
      if (!organizationInBd)
        throw Error('The organization with id ' + organizationId +
          ' doesn´t exists')

      let query = {
        include: [{
          model: Repository.State
          , attributes: ['value']
          , as: 'state'
        }, {
          model: Repository.System
          , attributes: ['foreignId']
          , as: 'system'
        }, {
          model: Repository.Environment
          , attributes: ['foreignId']
          , as: 'environment'
        }, {
          model: Repository.User
          , attributes: ['foreignId']
          , as: 'user'
        }, ]
        , order: [
          ['severity', 'DESC']
        ]
        , limit: 5
        , where: {
          organizationId: organizationInBd.id
          , stateId: config.state.pending_id
        }
        , attributes: ['id', 'title', 'description', 'severity']

      }
      return this.bugRepository.queryReport(query)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async statisticsForOrganizationBySeverity(organizationId, dateFrom, dateTo) {
    try {
      let organizationInBd = await this.organizationRepository.findByForeignId(
        organizationId)
      if (!organizationInBd)
        throw Error('The organization with id ' + organizationId +
          ' doesn´t exists')

      let query = {
        where: {
          organizationId: organizationInBd.id
          , createdAt: {
            [Op.gt]: dateFrom
            , [Op.lt]: dateTo
          }
        }
        , group: ['severity']
        , attributes: ['severity', [fn('COUNT', col(
          'severity')), 'count']]
      }
      return this.bugRepository.queryReport(query)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async statisticsForOrganizationByState(organizationId, dateFrom, dateTo) {
    try {
      let organizationInBd = await this.organizationRepository.findByForeignId(
        organizationId)
      if (!organizationInBd)
        throw Error('The organization with id ' + organizationId +
          ' doesn´t exists')

      let query = {
        where: {
          organizationId: organizationInBd.id
          , createdAt: {
            [Op.gt]: dateFrom
            , [Op.lt]: dateTo
          }
        }
        , group: ['stateId']
        , attributes: ['stateId', [fn('COUNT', col(
          'severity')), 'count']]
      }
      return this.bugRepository.queryReport(query)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async topUsersSolvingBugs(organizationId) {
    try {
      let organizationInBd = await this.organizationRepository.findByForeignId(
        organizationId)
      if (!organizationInBd)
        throw Error('The organization with id ' + organizationId +
          ' doesn´t exists')

      var today = new Date(Date.now())
      var dateFrom = new Date()
      dateFrom.setDate(today.getDate() - 30)
      let query = {
        include: [{
          model: Repository.User
          , attributes: ['name', 'email']
          , as: 'user'
        }]
        , limit: 10
        , where: {
          organizationId: organizationInBd.id
          , createdAt: {
            [Op.gt]: dateFrom
            , [Op.lt]: today
          }
          , stateId: config.state.completed_id
        }
        , group: ['user.id', 'userId']
        , attributes: ['userId', [fn('COUNT', col(
          'severity')), 'count']]
        , order: [
          ['count', 'DESC']
        ]
      }
      var users = await this.bugRepository.queryReport(query)
      return this.filterByUserNotNull(users)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async filterByUserNotNull(users) {
    var result = new Array()
    users.forEach(user => {
      if (user.userId) {
        result.push(user)
      }
    });
    return result
  }

  async bugsNotAssigned(organizationId, days) {
    try {
      let organizationInBd = await this.organizationRepository.findByForeignId(
        organizationId)
      if (!organizationInBd)
        throw Error('The organization with id ' + organizationId +
          ' doesn´t exists')

      var today = new Date(Date.now())
      var dateFrom = new Date()
      if (days)
        dateFrom.setDate(today.getDate() - days)
      else
        dateFrom.setDate(today.getDate() - 2)
      let query = {
        include: [{
          model: Repository.System
          , attributes: ['foreignId']
          , as: 'system'
        }, {
          model: Repository.Environment
          , attributes: ['foreignId']
          , as: 'environment'
        }]
        , where: {
          organizationId: organizationInBd.id
          , userId: null
          , createdAt: {
            [Op.lt]: dateFrom
          }
        }
        , attributes: ['id', 'foreignId', 'title', 'description'
          , 'severity', 'stateId'
        ]
      }
      return this.bugRepository.queryReport(query)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
