const config = require('config')
const Role = require('./role')
const Invitation = (schema, types) => {
  return schema.define('invitation', {
    id: {
      type: types.INTEGER
      , primaryKey: true
      , autoIncrement: true
    }
    , invitedEmail: {
      type: types.TEXT
      , allowNull: false
    }
    , status: {
      type: types.TEXT
      , allowNull: false
      , defaultValue: config.invitation.PENDING
    }
    , role: {
      type: types.INTEGER
      , validate: {
        len: Object.values(Role)
      }
      , defaultValue: Role.DEVELOPER
    }
  , })
}

module.exports = Invitation
