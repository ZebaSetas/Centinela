const config = require('./config/config')
const Sequelize = require('sequelize')
const {
  Pool
} = require('pg')
const Logger = require('centinela-logger')
var logger = new Logger(__filename)
const databaseConfig = config['database']
const dialectConfig = databaseConfig[databaseConfig.dialect]

const UserModel = require('../models/user')
const InvitationModel = require('../models/invitation')
const OrganizationModel = require('../models/organization')

module.exports = class Repository {
  constructor() {
    this.connection = null
  }

  static async connect() {
    this.connection = await new Sequelize(dialectConfig.database
      , dialectConfig.user
      , dialectConfig.password, dialectConfig.options)
    this.connection.options.logging = false
  }

  static async createDbIfNotExists() {
    const pool = new Pool({
      user: dialectConfig.user
      , host: dialectConfig.options['host']
      , database: 'postgres'
      , password: dialectConfig.password
      , port: dialectConfig.options['port']
    , })

    try {
      await pool.query(`CREATE DATABASE "${process.env.DATABASE_NAME}";`)
      await pool.query(
        `ALTER DATABASE "${process.env.DATABASE_NAME}" SET "TimeZone" TO 'America/Montevideo';`
      )
      await pool.end()
    } catch (err) {
      if (err.code !== '42P04') { //42P04 = DataBase exists
        logger.error(`Cannot create database: ${err.message}`)
      }
    }

  }

  static async loadModels() {
    const User = UserModel(this.connection, Sequelize)
    const Invitation = InvitationModel(this.connection, Sequelize)
    const Organization = OrganizationModel(this.connection, Sequelize)

    User.belongsTo(Organization)

    Organization.hasMany(User)
    Invitation.belongsTo(User)
    Invitation.belongsTo(Organization)

    module.exports.User = User
    module.exports.Invitation = Invitation
    module.exports.Organization = Organization
    return this.connection.sync()
  }

  static async initRepository() {
    try {
      await this.createDbIfNotExists()
      await this.connect()
      await this.loadModels()
    } catch (err) {
      logger.error(
        `Error while connecting to database: ${err}`)
      throw err
    }
  }
}
