const Repository = require('../repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class SystemRepository {
  constructor() {}
  async findByForeignId(id) {
    try {
      let system = await Repository.System.findOne({
        where: {
          foreignId: id
        }
      })
      return system
    } catch (err) {
      logger.error('Cant find system in BD with id ' + id + ': ' +
        err)
      throw Error('Cant find system in BD with id ' + id)
    }
  }

  async create(system) {
    return await Repository.System.create(system)
  }
}
