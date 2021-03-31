const Repository = require('./repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class EnvironmentRepository {
  constructor() {}
  async findByForeignId(id) {
    try {
      let environment = await Repository.Environment.findOne({
        where: {
          foreignId: id
        }
      })
      return environment
    } catch (err) {
      logger.error('Cant find environment in BD with id ' + id + ': ' +
        err)
      throw Error('Cant find environment in BD with id ' + id)
    }
  }

  async create(environment) {
    return await Repository.Environment.create(environment)
  }
}
