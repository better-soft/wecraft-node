const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

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
      defaultValue: true,
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
