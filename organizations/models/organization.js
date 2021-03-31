const Organization = (schema, types) => {
  return schema.define('organization', {
    name: {
      type: types.TEXT
      , allowNull: false
      , unique: true
    }
  })
}

module.exports = Organization
