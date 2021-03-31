const Environment = (schema, types) => {
  return schema.define('environment', {
    foreignId: {
      type: types.INTEGER
      , unique: true
    }
  , })
}

module.exports = Environment
