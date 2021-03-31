const UserRepository = require('../repositories/user-repository')

module.exports = class UserService {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async createForeignRelationTables(user) {
    let newUser = {
      foreignId: user.id
      , name: user.name
      , email: user.email
    }
    return await this.userRepository.create(newUser)
  }
}
