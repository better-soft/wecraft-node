const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = sequelize => {
  const Log = sequelize.define('log', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: () => uuid(),
    },
    gqlData: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    requestHeaders: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  })

  Log.associate = db => {
    db.log.belongsTo(db.user)
  }
  return Log
}
