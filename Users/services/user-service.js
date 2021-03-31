const UserRepository = require('../repositories/user-repository')
const HashService = require('./hash-service')
const OrganizationService = require('./organization-service')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const Ajv = require('ajv')
const config = require('config')
const QueueService = require('./queue-service')

const ajv = new Ajv()
const userSchema = {
  "properties": {
    "name": {
      "type": "string"
    }
    , "email": {
      "type": "string"
      , "format": "email"
    }
    , "password": {
      "type": "string"
    }
  }
  , "required": ["name", "email", "password"]
}

module.exports = class UserService {
  constructor() {
    this.repository = new UserRepository()
    this.organizationService = new OrganizationService();
    this.queueService = new QueueService(config.microservice_name)
  }

  async encryptPassword(user) {
    logger.debug(`Encrypting password for user ${user.name}`)
    user.password = await HashService.getHash(user.password)
    return user
  }

  toModel(user) {
    return {
      id: user.id
      , name: user.name
      , email: user.email
      , organizationId: user.organizationId
    }
  }

  getAll(limit, offset) {
    return this.repository.findAll(limit, offset)
  }

  async create(user) {
    user = await this.encryptPassword(user)
    user.email = user.email.toLowerCase()
    await this.throwErrorIfEmailExist(user.email)

    let createdUser = await this.repository.create(user)
    let userOrganization = await this.organizationService.getById(user.organizationId)
    createdUser.organizationId = userOrganization.foreignId
    let userForReturn = this.toModel(createdUser)
    this.queueService.send('user.create', userForReturn)

    return userForReturn
  }

  async throwErrorIfEmailExist(email) {
    var user
    try {
      user = await this.repository.findByEmail(email)
    } catch (err) {}
    if (user) {
      throw new Error(
        `Cannot create user, user with ${user.email} already exists`)
    }
  }

  async validateNewUser(user) {
    this.validateSchema(user)
    await this.throwErrorIfEmailExist(user.email)
  }

  validateSchema(user) {
    let valid = ajv.validate(userSchema, user)
    if (!valid)
      throw Error('The format data of provided user is invalid')
    return true
  }

  async getByEmail(email) {
    return await this.repository.findByEmail(email.toLowerCase())
  }

  async getById(id) {
    return await this.repository.findById(id)
  }
  async getAllUsersInOrganization(foreignId) {
    const internalOrganization = await this.organizationService.getByForeignId(
      foreignId)
    return await this.repository.findAllByOrganizationId(
      internalOrganization.id)
  }
}
