const Ajv = require('ajv')
const ajv = new Ajv()
const credentialSchema = {
  "properties": {
    "email": {
      "type": "string"
      , "format": "email"
    }
    , "password": {
      "type": "string"
    }
  }
  , "required": ["email", "password"]
}

const TokenService = require('./token-service')
const HashService = require('./hash-service')
const UserService = require('./user-service')
const OrganizationService = require('./organization-service')

module.exports = class LoginService {
  constructor() {
    this.userService = new UserService()
    this.organizationService = new OrganizationService()
    this.tokenService = new TokenService()
  }

  static validate(login) {
    const validate = ajv.compile(credentialSchema)
    let valid = validate(login)
    if (!valid)
      throw Error(
        `The format of provided credentials is invalid: ${validate.errors[0].message}`
      )
    return true
  }

  async login(credentials) {
    let userBD = await this.userService.getByEmail(credentials.email)
    let internalOrg = await this.organizationService.getById(userBD.organizationId)
    let isValidPassword = await HashService.checkHash(credentials.password
      , userBD.password)
    if (isValidPassword) {
      var newToken = TokenService.newToken({
        user: {
          name: userBD.name
          , email: userBD.email
          , id: userBD.id
          , role: userBD.role
        }
        , organizationId: internalOrg.foreignId
      })
      userBD.token = newToken
      return newToken
    } else {
      throw new Error(`Invalid credentials`)
    }

  }
}
