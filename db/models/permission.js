const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = sequelize => {
  const Permission = sequelize.define('permission', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: () => uuid(),
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })

  Permission.associate = db => {
    db.permission.belongsToMany(db.role, { through: 'permission_roles' })
  }

  return Permission
}
