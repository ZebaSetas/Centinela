const moment = require('moment');
const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const ReportService = require('../services/report-service')

module.exports = class UserController {
  constructor() {
    this.reportService = new ReportService()
  }

  critical = async(req, res) => {
    const initTime = new Date().getTime()
    let organizationId = req.bugData.organizationId

    logger.debug(`New request to obtain Critital Bugs not resolved}`
      , initTime)
    try {
      var report = await this.reportService.criticalBugsOfOrganization(
        organizationId)
    } catch (err) {
      let errorMessage = `Error creating Report`
      logger.error(`${errorMessage}: ${err.message}`, initTime)
      return res.status(400).json({
        error: errorMessage
        , trace: err.message
      })
    }
    logger.info(`Report created`, initTime)
    return res.status(200).json(report)
  }

  statistics = async(req, res) => {
    const initTime = new Date().getTime()
    let organizationId = req.userData.organizationId
    logger.debug(
      `New request to obtain Statistics of Bugs by organization: From:[${req.query.dateFrom} - To:${req.query.dateTo}]`
      , initTime
    )
    try {
      let dateFrom = moment(req.query.dateFrom, 'DD/MM/YYYY', true)
      let dateTo = moment(req.query.dateTo, 'DD/MM/YYYY', true)
      dateTo.add(1, 'd')
      if (!dateFrom.isValid() || !dateTo.isValid()) {
        throw new Error(`Error parsing date on the query string`)
      }
      logger.debug(`New dates for report From:[${dateFrom} - To:${dateTo}]`
        , initTime)
      var bySeverity = await this.reportService.statisticsForOrganizationBySeverity(
        organizationId, dateFrom, dateTo)
      var byState = await this.reportService.statisticsForOrganizationByState(
        organizationId, dateFrom, dateTo)
    } catch (err) {
      let errorMessage = `Error creating Report`
      logger.error(`${errorMessage}: ${err.message}`, initTime)
      return res.status(400).json({
        error: errorMessage
        , trace: err.message
      })
    }
    logger.info(`Report created`, initTime)
    return res.status(200).json({
      bySeverity
      , byState
    })
  }

  topUsersSolvingBugs = async(req, res) => {
    const initTime = new Date().getTime()
    let organizationId = req.userData.organizationId
    logger.debug(
      `New request to obtain top users who solved more bugs by organization`
      , initTime)
    try {
      var report = await this.reportService.topUsersSolvingBugs(
        organizationId)
    } catch (err) {
      let errorMessage = `Error creating Report`
      logger.error(`${errorMessage}: ${err.message}`, initTime)
      return res.status(400).json({
        error: errorMessage
        , trace: err.message
      })
    }
    logger.info(`Report created`, initTime)
    return res.status(200).json(report)
  }

  bugsNotAssigned = async(req, res) => {
    const initTime = new Date().getTime()
    let organizationId = req.userData.organizationId
    let days = req.query.days
    if (days) {
      logger.debug(
        `New request to obtain bugs not assigned for more than ${days} days by organization`
        , initTime)
    } else {
      logger.debug(
        `New request to obtain bugs not assigned for more than 2 days by organization`
        , initTime)
    }
    try {
      var report = await this.reportService.bugsNotAssigned(
        organizationId, days)
    } catch (err) {
      let errorMessage = `Error creating Report`
      logger.error(`${errorMessage}: ${err.message}`, initTime)
      return res.status(400).json({
        error: errorMessage
        , trace: err.message
      })
    }
    logger.info(`Report created`, initTime)
    return res.status(200).json(report)
  }
}
