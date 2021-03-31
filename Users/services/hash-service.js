const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = class HashService {
  constructor() {}

  static async checkHash(password, hash) {
    const match = await bcrypt.compare(password, hash)
    if (match) {
      return true
    }
    return false
  }

  static async getHash(password) {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      return await bcrypt.hash(password, salt)
    } catch (err) {
      throw new Error(`Error creating hash:` + err)
    }
  }
}
