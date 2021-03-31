const Organization = (schema, types) => {
  return schema.define('organization', {
    foreignId: {
      type: types.INTEGER
      , unique: true
    }
    , name: {
      type: types.TEXT
      , allowNull: false
      , unique: true
    }
  , })
}

module.exports = Organization
