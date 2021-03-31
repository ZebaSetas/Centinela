const EnvironmentRepository = require('../repositories/environment-repository')
const SystemRepository = require('../repositories/system-repository')
const OrganizationRepository = require(
  '../repositories/organization-repository')
var httpContext = require('express-http-context');
var Ajv = require('ajv')
const Role = require('../models/role');
const {
  Environment
} = require('../repositories/repository');
const Logger = require('centinela-logger');
var logger = new Logger(__filename)
var ajv = new Ajv({
  allErrors: true
  , verbose: true
})

module.exports = class EnvironmentService {
  constructor() {
    this.environmentRepository = new EnvironmentRepository()
    this.organizationRepository = new OrganizationRepository()
    this.systemRepository = new SystemRepository()
  }

  async createForeignRelationTables(environment) {
    var organizationBd = await this.organizationRepository.findByForeignId(
      environment.organizationId)
    if (!organizationBd) {
      organizationBd = await this.createOrganization(environment
        .organizationId)
      logger.info("Organization " + organizationBd + " was created")
    }
    var systemBd = await this.systemRepository.findByForeignId(environment.systemId)
    if (!systemBd) {
      systemBd = await this.createSystem(environment.systemId)
      logger.info("System " + systemBd + " was created")
    }
    var environmentBd = await this.environmentRepository.findByForeignId(
      environment.environmentId)
    if (!environmentBd) return await this.createEnvironment(
      environment.environmentId)
    else throw new Error("Environment whit id " + environment.environmentId +
      " already exists")

  }

  async createOrganization(organizationId) {
    let newOrganization = {
      foreignId: organizationId
    }
    return await this.organizationRepository.create(
      newOrganization)
  }

  async createSystem(systemId) {
    let newSystem = {
      foreignId: systemId
    }
    return await this.systemRepository.create(newSystem)
  }

  async createEnvironment(environmentId) {
    let newEnvironment = {
      foreignId: environmentId
    }
    var environmentDB = await this.environmentRepository.create(
      newEnvironment)

    return environmentDB
  }
}
