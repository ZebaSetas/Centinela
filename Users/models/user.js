const Role = require('./role')

const User = (schema, types) => {
  return schema.define('user', {
    id: {
      type: types.INTEGER
      , primaryKey: true
      , autoIncrement: true
    }
    , name: {
      type: types.TEXT
      , allowNull: false
    }
    , email: {
      type: types.TEXT
      , unique: true
      , allowNull: false
    }
    , password: {
      type: types.TEXT
      , allowNull: false
    }
    , role: {
      type: types.INTEGER
      , validate: {
        len: Object.values(Role)
      }
      , defaultValue: Role.DEVELOPER
    }
  });
};

module.exports = User
