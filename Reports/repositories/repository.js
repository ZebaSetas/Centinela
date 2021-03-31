const config = require('./config/config')
const stateConfig = require('../config/default.json')
const Sequelize = require('sequelize')
const {
  Pool
} = require('pg')
const BugModel = require('../models/bug')
const SystemModel = require('../models/system')
const EnvironmentModel = require('../models/environment')
const OrganizationModel = require('../models/organization')
const StateModel = require('../models/state')
const UserModel = require('../models/user')
const Logger = require('centinela-logger')
var logger = new Logger(__filename)
const databaseConfig = config['database']
const dialectConfig = databaseConfig[databaseConfig.dialect]

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
    const Bug = BugModel(this.connection, Sequelize)
    const Organization = OrganizationModel(this.connection, Sequelize)
    const System = SystemModel(this.connection, Sequelize)
    const Environment = EnvironmentModel(this.connection, Sequelize)
    const State = StateModel(this.connection, Sequelize)
    const User = UserModel(this.connection, Sequelize)

    //User.belongsTo(Organization)
    //Organization.hasMany(User)

    Bug.belongsTo(System, {
      as: 'system'
    })
    System.hasMany(Bug, {
      as: 'bug'
    })

    Bug.belongsTo(Environment, {
      as: 'environment'
    })
    Environment.hasMany(Bug, {
      as: 'bug'
    })

    Bug.belongsTo(Organization, {
      as: 'organization'
    })
    Organization.hasMany(Bug, {
      as: 'bug'
    })

    Bug.belongsTo(User, {
      as: 'user'
    })
    User.hasMany(Bug, {
      as: 'bug'
    })

    Bug.belongsTo(State, {
      as: 'state'
      , foreignKey: 'stateId'
    })

    module.exports.Bug = Bug
    module.exports.Environment = Environment
    module.exports.Organization = Organization
    module.exports.System = System
    module.exports.User = User
    module.exports.State = State

    return this.connection.sync()
  }

  static async loadStates() {
    let pendingId = stateConfig.state.pending_id
    let completedId = stateConfig.state.completed_id
    const State = StateModel(this.connection, Sequelize)

    State.findOrCreate({
      where: {
        id: pendingId
      }
      , defaults: {
        id: pendingId
        , value: stateConfig.state.pending_name_bd
      }
    , });

    State.findOrCreate({
      where: {
        id: completedId
      }
      , defaults: {
        id: completedId
        , value: stateConfig.state.completed_name_bd
      }
    , });
  }

  static async initRepository() {
    try {
      await this.createDbIfNotExists()
      await this.connect()
      await this.loadModels()
      await this.loadStates()
    } catch (err) {
      logger.error(`Error while connecting to database: ${err}`)
      throw err
    }
  }
}
