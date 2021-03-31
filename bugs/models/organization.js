const Organization = (schema, types) => {
  return schema.define('organization', {
    foreignId: {
      type: types.INTEGER
      , unique: true
    }
  , })
}

module.exports = Organization
