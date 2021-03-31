const UserRepository = require('../repositories/user-repository')
var httpContext = require('express-http-context');
var Ajv = require('ajv')
const Role = require('../models/role')

var ajv = new Ajv({
  allErrors: true
  , verbose: true
})

module.exports = class UserService {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async createForeignRelationTables(user) {
    return this.createUser(user.id)
  }

  async createUser(userId) {
    let newUser = {
      foreignId: userId
    }
    return await this.userRepository.create(newUser)
  }

}
