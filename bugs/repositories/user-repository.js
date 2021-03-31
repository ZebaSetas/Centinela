const Repository = require('../repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class UserRepository {
  constructor() {}
  async findByForeignId(id) {
    let user = await Repository.User.findOne({
      where: {
        foreignId: id
      }
    })
    return user
  } catch (err) {
    logger.error('Cant find user in BD with id ' + id + ': ' +
      err)
    throw Error('Cant find user in BD with id ' + id)
  }

  async create(user) {
    return await Repository.User.create(user)
  }
}
