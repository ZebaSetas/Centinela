const BugService = require('../services/bug-service')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class BugController {
  constructor() {
    this.bugService = new BugService()
  }

  createBug = async(req, res) => {
    const initTime = new Date().getTime()
    var bug = req.body
    bug.environmentId = req.bugData.environmentId
    bug.organizationId = req.bugData.organizationId
    bug.systemId = req.bugData.systemId
    logger.debug("Arrived request to create bug with data: " + JSON.stringify(
      req.body))
    try {
      this.bugService.validateBugToCreate(bug)
      await this.bugService.queueBugCreation(bug)
      logger.debug("Bug queued. Debug:" + JSON.stringify(bug), initTime)
      return res.status(201).json({
        message: 'Bug creation queued successfully'
      })
    } catch (err) {
      logger.error(err, initTime)
      return res.status(400).json({
        error: err.message
      })
    }
  }

  updateBug = async(req, res) => {
    var id = Number.parseInt(req.params.id)
    var initTime = new Date().getTime()
    var user = req.userData.user;
    let bug = req.body;
    bug.organizationId = req.userData.organizationId
    bug.id = id;
    logger.debug("Arrived request to update bug with data: " + JSON.stringify(
      req.body))
    try {
      this.bugService.validateBugToUpdate(bug)
      var bugBD = await this.bugService.updateBug(bug, user);

      logger.debug("Bug updated with data " + JSON.stringify(bugBD)
        , initTime)
      return res.status(200).json({
        message: 'Bug updated'
        , bug: bugBD
      });
    } catch (err) {
      logger.error(err, initTime)
      return res.status(400).json({
        error: err.message
      });
    }
  }

  getBugs = async(req, res) => {
    try {
      var initTime = new Date().getTime()
      var organizationId = req.userData.organizationId
      logger.debug('Arrived request to get bugs with data: state=' + req.query
        .state +
        ' order=' + req.query.order + ' offset=' + req.query.offset +
        ' limit=' + req.query.limit)
      let offset = Number.parseInt(req.query.offset)
      let limit = Number.parseInt(req.query.limit)
      let state = req.query.state
      let order = req.query.order
      var bugs = await this.bugService.findAll(limit, offset, state, order
        , organizationId)
      logger.debug('Get bugs respond OK ', initTime)
      return res.status(200).json(bugs)
    } catch (err) {
      logger.debug('Query params invalid:' + err)
      return res.status(400).json({
        error: 'Query params invalid: ' + err
      });
    }
  }

  getBug = async(req, res) => {
    try {
      var id = Number.parseInt(req.params.id)
      var bug = await this.bugService.getById(id)
      var bugModel = await this.bugService.toModel(bug)
      return res.status(200).json(bugModel)
    } catch (err) {
      logger.debug(err)
      return res.status(400).json({
        error: 'Cant find bug'
      });
    }
  }
}
