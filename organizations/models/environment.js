const Environment = (schema, types) => {
  return schema.define('environment', {
    id: {
      type: types.INTEGER
      , primaryKey: true
      , autoIncrement: true
    }
    , name: {
      type: types.TEXT
      , allowNull: false
    }
  , })
}

module.exports = Environment
