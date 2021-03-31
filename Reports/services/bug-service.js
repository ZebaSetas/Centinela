const config = require('config')
const EnvironmentRepository = require('../repositories/environment-repository')
const SystemRepository = require('../repositories/system-repository')
const OrganizationRepository = require(
  '../repositories/organization-repository')
const BugRepository = require(
  '../repositories/bug-repository')
const UserRepository = require(
  '../repositories/user-repository')

module.exports = class BugService {
  constructor() {
    this.environmentRepository = new EnvironmentRepository()
    this.organizationRepository = new OrganizationRepository()
    this.systemRepository = new SystemRepository()
    this.bugRepository = new BugRepository()
    this.userRepository = new UserRepository()
  }

  async createBug(bug) {
    let stateId = config.state.pending_id
    let organizationId = await this.generateLocalOrganization(bug.organizationId)
    let systemId = await this.generateLocalSystem(bug.systemId)
    let environmentId = await this.generateLocalEnvironment(bug.environmentId)

    let newBug = {
      foreignId: bug.id
      , title: bug.title
      , description: bug.description
      , severity: bug.severity
      , organizationId: organizationId
      , systemId: systemId
      , environmentId: environmentId
      , stateId: stateId
    }
    let bugBD = await this.bugRepository.create(newBug)
    return bugBD
  }

  async generateLocalOrganization(organizationId) {
    var organizationBD = await this.organizationRepository.findByForeignId(
      organizationId)
    if (organizationBD)
      return organizationBD.id
    else {
      await this.createOrganization(organizationId)
      var recentlyCreatedOrganization = await this.organizationRepository.findByForeignId(
        organizationId)
      return recentlyCreatedOrganization.id
    }
  }

  async generateLocalSystem(systemId) {
    var systemBD = await this.systemRepository.findByForeignId(
      systemId)
    if (systemBD)
      return systemBD.id
    else {
      await this.createSystem(systemId)
      var recentlyCreatedSystem = await this.systemRepository.findByForeignId(
        systemId)
      return recentlyCreatedSystem.id
    }
  }

  async generateLocalEnvironment(environmentId) {
    var environmentBD = await this.environmentRepository.findByForeignId(
      environmentId)
    if (environmentBD)
      return environmentBD.id
    else {
      await this.createEnvironment(environmentId)
      var recentlyCreatedEnvironment = await this.environmentRepository.findByForeignId(
        environmentId)
      return recentlyCreatedEnvironment.id
    }
  }

  async createOrganization(organizationId) {
    let newOrganization = {
      foreignId: organizationId
    }
    await this.organizationRepository.create(
      newOrganization)
  }

  async createSystem(systemId) {
    let newSystem = {
      foreignId: systemId
    }
    await this.systemRepository.create(newSystem)
  }

  async createEnvironment(environmentId) {
    let newEnvironment = {
      foreignId: environmentId
    }
    var environmentDB = await this.environmentRepository.create(
      newEnvironment)

    return environmentDB
  }

  async updateBug(bug) {
    var bugBd = await this.bugRepository.findByForeignId(bug.id)

    if (bugBd == null) throw new Error('Bug with id ' + bug.id +
      ' does not exists')
    await this.generateLocalOrganization(bug.organizationId)
    await this.generateLocalSystem(bug.systemId)
    await this.generateLocalEnvironment(bug.environmentId)
    if (bug.userId) {
      var user = await this.userRepository.findByForeignId(bug.userId)
      if (user) bugBd.userId = user.id
      else throw new Error("User does not exists")
    }

    if (bug.state.id != bugBd.stateId) bugBd.stateId = bug.state.id
    if (bug.title != bugBd.title) bugBd.title = bug.title
    if (bug.description != bugBd.description) bugBd.description = bug.description
    if (bug.severity != bugBd.severity) bugBd.severity = bug.severity

    bugBd = await this.bugRepository.update(bugBd)

    return bugBd
  }
}
