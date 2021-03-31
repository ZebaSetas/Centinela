const Bug = (schema, types) => {
  return schema.define('bug', {
    id: {
      type: types.INTEGER
      , primaryKey: true
      , autoIncrement: true
    }
    , title: {
      type: types.TEXT
      , allowNull: false
    }
    , description: {
      type: types.TEXT
      , allowNull: true
    }
    , severity: {
      type: types.INTEGER
      , allowNull: true
    }
  })
}

module.exports = Bug
