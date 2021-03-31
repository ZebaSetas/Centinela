const System = (schema, types) => {
  return schema.define('system', {
    id: {
      type: types.INTEGER
      , primaryKey: true
      , autoIncrement: true
    }
    , name: {
      type: types.TEXT
      , allowNull: false
    }
  })
}

module.exports = System
