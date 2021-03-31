const System = (schema, types) => {
  return schema.define('system', {
    foreignId: {
      type: types.INTEGER
      , unique: true
    }
  })
}

module.exports = System
