const OrganizationRepository = require(
  '../repositories/organization-repository')
const QueueService = require('./queue-service')
const Logger = require('centinela-logger')
const Ajv = require('ajv')
const config = require('config')
const logger = new Logger(__filename)
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const orgSchema = {
  "properties": {
    "name": {
      "type": "string"
    }
  }
  , "required": ["name"]
}

module.exports = class OrganizationService {
  constructor() {
    this.repository = new OrganizationRepository()
    this.queueService = new QueueService(config.microservice_name)
  }

  async getById(organizationId) {
    return await this.repository.findById(organizationId)
  }

  async getAll() {
    let organizations = await this.repository.findAll()
    if (!organizations)
      return []
    return organizations
  }

  async create(organization) {
    let createdOrg = this.toModel(await this.repository.save(this.toModel(
      organization)))
    this.queueService.send('organization.create', createdOrg)
    return createdOrg
  }

  toModel(object) {
    return {
      id: object.id
      , name: object.name
    }
  }

  validate(org) {
    let valid = ajv.validate(orgSchema, org)
    if (!valid) {
      logger.error(
        `Organization format was not validated ${JSON.stringify(org)}`)
      throw Error('Invalid organization format')
    }
    logger.debug(
      `Organization format was succefull validated ${JSON.stringify(org)}`
    )
    return true
  }
}
