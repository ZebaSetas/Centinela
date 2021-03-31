const config = require('config')
const SystemRepository = require('../repositories/system-repository')
const EnvironmentRepository = require('../repositories/environment-repository')
const OrganizationService = require('./organization-service')
const TokenService = require('./token-service')

const QueueService = require('./queue-service')

module.exports = class SystemService {
  constructor() {
    this.systemRepository = new SystemRepository()
    this.environmentRepository = new EnvironmentRepository()
    this.organizationService = new OrganizationService()
    this.queueService = new QueueService(config.microservice_name)
  }

  async getById(systemId) {
    let system = await this.systemRepository.getById(systemId)
    if (!system) {
      throw new Error(`Could not find a system with id ${systemId}`)
    }
    return system
  }

  async getAllByOrganizationId(organizationId) {
    return await this.systemRepository.findAllByOrganizationId(
      organizationId)
  }

  async createSystem(newSystem) {
    await this.organizationService.getById(newSystem.organizationId)
    const existingSystems = await this.getAllByOrganizationId(newSystem.organizationId)
    existingSystems.forEach(system => {
      if (system.name.toLowerCase() === newSystem.name.toLowerCase())
        throw new Error(
          `Cannot create system, this organization already has a system named: ${system.name}`
        )
    })
    let createdSystem = await this.systemRepository.create(newSystem)
    this.queueService.send('system.create', createdSystem)
    return createdSystem
  }

  async getAllEnvironmentsBySystemId(systemId) {
    await this.getById(systemId)
    return await this.environmentRepository.findAllBySystemId(systemId)
  }

  async createEnvironment(data) {
    let newEnvironment = {
      name: data.envName
      , systemId: data.systemId
      , keyConnection: ''
    }
    const existingSystems = await this.getAllByOrganizationId(data.organizationId)
    var result = existingSystems.map(x => x.id === data.systemId)
    if (!result[0]) {
      throw new Error(
        `Cannot create environment, this system is not part of your organization`
      )
    }
    // console.log(`el systema no existe en esa organizacion`);
    const existingEnvs = await this.getAllEnvironmentsBySystemId(data.systemId)
    existingEnvs.forEach(environment => {
      if (environment.name === newEnvironment.name)
        throw new Error(
          `Cannot create environment, this system already has an environment named: ${newEnvironment.name}`
        )
    })
    const environmentDB = await this.environmentRepository.create(
      newEnvironment)
    newEnvironment.environmentId = environmentDB.dataValues.id
    newEnvironment.organizationId = data.organizationId
    const token = TokenService.newNonExpiringToken(newEnvironment)
    newEnvironment.keyConnection = token
    this.queueService.send('environment.create', newEnvironment)
    return newEnvironment
  }

}
