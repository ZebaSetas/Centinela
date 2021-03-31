const Preference = (schema, types) => {
  return schema.define('preference', {
    id: {
      type: types.INTEGER
      , autoIncrement: true
    }
    , isEnabled: {
      type: types.BOOLEAN
      , allowNull: false
    }
    , isImmediate: {
      type: types.BOOLEAN
      , allowNull: false
    }
    , timeHour: {
      type: types.INTEGER
      , allowNull: false
      , validate: {
        max: 23
        , min: 0
      }
    }
    , timeMinute: {
      type: types.INTEGER
      , allowNull: false
      , validate: {
        max: 59
        , min: 0
      }
    }
    , severity: {
      type: types.INTEGER
      , primaryKey: true
      , validate: {
        max: 4
        , min: 1
      }
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
    , lastSent: {
      type: types.DATE
    }
  });
};

module.exports = Preference
