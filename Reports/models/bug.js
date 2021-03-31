const Bug = (schema, types) => {
  return schema.define('bug', {
    foreignId: {
      type: types.INTEGER
      , unique: true
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
