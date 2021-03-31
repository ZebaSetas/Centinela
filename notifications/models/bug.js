const Bug = (schema, types) => {
  return schema.define('bug', {
    id: {
      type: types.INTEGER
      , primaryKey: true
        //, autoIncrement: true  DISABLED BECAUSE THE ID COMES WITH THE BUG OBJECT BEING RECEIVED
    }
    , title: {
      type: types.TEXT
      , allowNull: false
    }
    , description: {
      type: types.TEXT
      , allowNull: false
    }
    , severity: {
      type: types.INTEGER
      , allowNull: false
    }
    , systemId: {
      type: types.INTEGER
      , allowNull: false
    }
    , environmentId: {
      type: types.INTEGER
      , allowNull: false
    }
    , organizationId: {
      type: types.INTEGER
      , allowNull: false
    }
    , userId: {
      type: types.INTEGER
      , allowNull: false
    }
    , stateId: {
      type: types.INTEGER
      , allowNull: false
    }
  })
}

module.exports = Bug
