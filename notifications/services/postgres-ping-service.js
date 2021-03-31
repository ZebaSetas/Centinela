require('dotenv').config()
const {
  Client
} = require('pg');
const Logger = require('centinela-logger')
const logger = new Logger(__filename, '')

module.exports = class PostgresPingService {
  constructor() {
    this.client = this.buildClient()
    this.client.connect()
  }

  async isAlive() {
    try {
      var ping = await this.ping();
      if (!ping) return "Postgres is dead"
      return ping
    } catch (err) {
      logger.error(err);
      return "Postgres is dead"
    }
  }
  async ping() {
    var result = await this.client.query('SELECT NOW()')
      .then(result => {
        return "pong"
      })
      .catch(e => {
        console.error(e.stack)
        return "Postgres is dead"
      }).finally(() => {
        this.client.end();
      });
    return result
  }

  buildClient = function (e) {
    try {
      const client = new Client({
        user: process.env.DATABASE_USER
        , host: process.env.DATABASE_HOST
        , database: process.env.DATABASE_NAME
        , password: process.env.DATABASE_PASSWORD
        , port: process.env.DATABASE_PORT
      });
      return client
    } catch (err) {
      logger.error(err)
      throw Error('Could not connected to redis')
    }
  }

}
