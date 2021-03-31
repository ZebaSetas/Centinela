const config = require('./config/config')
const Sequelize = require('sequelize')
const {
  Pool
} = require('pg')
  // const BugModel = require('../models/bug')

// const Logger = require('../logger/centinela-logger')
// var logger = new Logger(__filename)
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
        // logger.error(`Cannot create database: ${err.message}`)
      }
    }

  }

  static async loadModels() {
    // const Bug = BugModel(this.connection, Sequelize)

    // module.exports.Bug = Bug

    return this.connection.sync()
  }

  static async initRepository() {
    try {
      await this.createDbIfNotExists()
      await this.connect()
      await this.loadModels()
    } catch (err) {
      // logger.error(
      //   `Error while connecting to database: ${err}`)
      throw err
    }
  }
}
