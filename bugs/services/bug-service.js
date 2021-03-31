const BugRepository = require('../repositories/bug-repository')
const EnvironmentRepository = require('../repositories/environment-repository')
const SystemRepository = require('../repositories/system-repository')
const OrganizationRepository = require(
  '../repositories/organization-repository')
const UserRepository = require('../repositories/user-repository')
const BugQueue = require('./queue-service')
const config = require('config')
var Ajv = require('ajv')
const Role = require('../models/role')

var ajv = new Ajv({
  allErrors: true
  , verbose: true
})

const bugSchema = {
  "type": "object"
  , "properties": {
    "title": {
      "type": "string"
    }
    , "description": {
      "type": "string"
    }
    , "severity": {
      "type": "integer"
      , "minimum": 1
      , "maximum": 4
    }
    , "stateId": {
      "type": "integer"
    }
    , "user": {
      "type": "string"
    }
    , "environmentId": {
      "type": "integer"
    }
    , "organizationId": {
      "type": "integer"
    }
    , "systemId": {
      "type": "integer"
    }
  }
  , "additionalProperties": true
  , "required": ["title", "environmentId", "systemId", "organizationId"]
}

module.exports = class BugService {
  constructor() {
    this.bugRepository = new BugRepository()
    this.organizationRepository = new OrganizationRepository()
    this.systemRepository = new SystemRepository()
    this.environmentRepository = new EnvironmentRepository()
    this.userRepository = new UserRepository()
    this.bugQueue = new BugQueue(config.microservice_name)
    this.bugQueue.connect()
  }

  toModel(bug) {
    var environmentId = null
    var userId = null
    var organizationId = null
    var systemId = null
    if (bug.environment) {
      environmentId = bug.environment.foreignId
    }
    if (bug.user) {
      userId = bug.user.foreignId
    }
    if (bug.system) {
      systemId = bug.system.foreignId
    }
    if (bug.organization) {
      organizationId = bug.organization.foreignId
    }

    const modelBug = {
      id: bug.id
      , title: bug.title
      , description: bug.description
      , severity: bug.severity
      , environmentId: environmentId
      , systemId: systemId
      , userId: userId
      , state: bug.state
      , organizationId: organizationId
    }

    return modelBug
  }

  bugsToModel(bugs) {
    var modelbugs = new Array();
    for (const bug of bugs) {
      modelbugs.push(this.toModel(bug))
    }
    return modelbugs
  }

  async findAll(limit, offset, state, order, organizationId) {
    const organization = await this.organizationRepository.findByForeignId(
      organizationId)
    const bugs = await this.bugRepository.findAll(limit, offset, state
      , order
      , organization.id)
    return this.bugsToModel(bugs)
  }

  async queueBugCreation(bug) {
    await this.bugQueue.send('bug.new', bug)
  }

  async createBug(bug) {
    bug.stateId = config.state.pending_id

    let bugToBd = await this.buildBugWithLocalIds(bug)

    let bugBd = await this.bugRepository.create(bugToBd)

    bug.id = bugBd.id //must use system wide Ids but also the stored id;
    this.bugQueue.send('bug.create', bug)
    return bug
  }

  async buildBugWithLocalIds(bug) {
    let localBug = JSON.parse(JSON.stringify(bug)) //must copy the values not reference them
    var environmentBD = await this.environmentRepository.findByForeignId(
      bug.environmentId)
    if (environmentBD)
      localBug.environmentId = environmentBD.id
    else
      throw new Error("Bug does not bring environment")

    var systemBD = await this.systemRepository.findByForeignId(bug.systemId)
    if (systemBD)
      localBug.systemId = systemBD.id
    else
      throw new Error("Bug does not bring system")

    var organizationBD = await this.organizationRepository.findByForeignId(
      bug.organizationId)
    if (organizationBD)
      localBug.organizationId = organizationBD.id
    else
      throw new Error("Bug does not bring organization")
    return localBug
  }

  //TODO: REFACTOREAR LA CONVERSION DE IDs
  async updateBug(bug, user) {
    var bugBd = await this.bugRepository.findById(bug.id)
    if (bugBd == null)
      throw new Error(`Bug with id ${bug.id} does not exists`)
    var role = user.role
    var userIsAdmin = role === 1
    if (!userIsAdmin) {
      this.validateUpdateBugForDeveloper(bug, bugBd)
    }

    if (bug.environmentId) {
      var env = await this.environmentRepository.findByForeignId(
        bug.environmentId)
      if (env)
        bugBd.environmentId = env.id
      else
        throw new Error("Environment does not exists")
    }

    if (bug.systemId) {
      var systemBD = await this.systemRepository.findByForeignId(
        bug.systemId)
      if (systemBD)
        bugBd.systemId = systemBD.id
      else
        throw new Error("System does not exists")
    }

    if (bug.organizationId) {
      var organizationBD = await this.organizationRepository.findByForeignId(
        bug.organizationId)
      if (organizationBD)
        bugBd.organizationId = organizationBD.id
      else
        throw new Error("Organization does not exists")
    }

    if (bug.userId) {
      var user = await this.userRepository.findByForeignId(bug.userId)
      if (user)
        bugBd.userId = user.id
      else
        throw new Error("User does not exists")
    }

    if (bug.stateId)
      bugBd.stateId = bug.stateId
    if (bug.title)
      bugBd.title = bug.title
    if (bug.description)
      bugBd.description = bug.description
    if (bug.severity)
      bugBd.severity = bug.severity

    bugBd = await this.bugRepository.update(bugBd)
    this.bugQueue.send('bug.update', this.toModel(bugBd))
    return this.toModel(bugBd)
  }

  validateUpdateBugForDeveloper(bug, bugBd) {
    if (bugBd.title != bug.title)
      throw Error(
        `Error to update bug with id ${bug.id}. Title cannot be updated by a Developer user`
      )
    if (bugBd.description != bug.description)
      throw Error(
        `Error to update bug with id ${bug.id}. Description cannot be updated by a Developer user`
      )
    if (bugBd.severity != bug.severity)
      throw Error(
        `Error to update bug with id ${bug.id}. Severity cannot be updated by a Developer user`
      )
  }

  validateBugToCreate(bug) {
    this.validateBug(bug)
    if (bug.stateId)
      throw Error('Cannot create bug with defined state')
    if (bug.user)
      throw Error('Cannot create bug with defined user')
    return true
  }

  validateBugToUpdate(bug) {
    this.validateBug(bug)
    if (!bug.stateId)
      throw Error('Cannot update bug without a state')
    return true
  }

  validateBug(bug) {
    var validate = ajv.compile(bugSchema)
    let isValid = validate(bug)
    if (!isValid) {
      throw new Error(
        `The format of provided bug data is invalid: ${validate.errors[0].message}`
      )
    }
    return isValid
  }

  async getById(id) {
    return await this.bugRepository.findById(id)
  }
}
