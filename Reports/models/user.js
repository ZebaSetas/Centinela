const User = (schema, types) => {
  return schema.define('user', {
    foreignId: {
      type: types.INTEGER
      , unique: true
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
  , })
}

module.exports = User
