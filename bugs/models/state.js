const State = (schema, types) => {
  return schema.define('state', {
    id: {
      type: types.INTEGER
      , allowNull: false
      , primaryKey: true
    }
    , value: {
      type: types.TEXT
      , allowNull: false
    }
  , });
}

module.exports = State
