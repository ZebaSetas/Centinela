require('dotenv').config()

module.exports = {
  database: {
    dialect: 'postgres'
    , postgres: {
      user: process.env.DATABASE_USER
      , password: process.env.DATABASE_PASSWORD
      , database: process.env.DATABASE_NAME
      , options: {
        host: process.env.DATABASE_HOST
        , port: process.env.DATABASE_PORT
        , dialect: 'postgres'
        , timezone: 'America/Montevideo'
        , dialectOptions: {
          useUTC: false
        }
        , define: {
          defaultScope: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }
        }
      }
    }
  }
  , testDB: {
    url: process.env.TEST_DATABASE_URL
    , dialect: 'postgres'
  , },

}
