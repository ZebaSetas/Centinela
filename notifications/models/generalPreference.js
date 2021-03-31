const GeneralPreference = (schema, types) => {
  return schema.define('generalPreference', {
    id: {
      type: types.INTEGER
      , autoIncrement: true
    }
    , userId: {
      type: types.INTEGER
      , primaryKey: true
      , allowNull: false
    }
    , userEmail: {
      type: types.TEXT
      , allowNull: false
      , validate: {
        isEmail: true
      }
    }
    , organizationId: {
      type: types.INTEGER
      , allowNull: false
    }
    , isEnabled: {
      type: types.BOOLEAN
      , allowNull: false
    }
    , lastSent: {
      type: types.DATE
    }
  });
};

module.exports = GeneralPreference
