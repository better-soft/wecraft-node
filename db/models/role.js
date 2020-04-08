const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = sequelize => {
  const Role = sequelize.define('role', {
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

  Role.associate = db => {
    db.role.hasMany(db.user)
    db.role.belongsToMany(db.permission, { through: 'permission_roles' })
  }

  return Role
}
