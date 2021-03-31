const User = (schema, types) => {
  return schema.define('user', {
    foreignId: {
      type: types.INTEGER
      , unique: true
    }
  , })
}

module.exports = User
