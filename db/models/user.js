const Sequelize = require('sequelize')
const uuid = require('uuid/v4')
const { SMS_AUTH_ENABLED } = require('../../setup/config')

module.exports = sequelize => {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: () => uuid(),
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    smsAuthEnabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: SMS_AUTH_ENABLED,
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  })

  User.associate = db => {
    db.user.belongsTo(db.role)
  }

  return User
}
