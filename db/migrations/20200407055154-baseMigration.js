module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.createTable(
          'users',
          {
            id: {
              primaryKey: true,
              type: Sequelize.UUID,
              allowNull: false,
            },
            email: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: {
                isEmail: true,
              },
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
            phoneNumber: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            smsAuthEnabled: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          },
          {
            transaction,
          }
        )
        await queryInterface.createTable(
          'roles',
          {
            id: {
              primaryKey: true,
              type: Sequelize.UUID,
              allowNull: false,
            },
            name: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          },
          {
            transaction,
          }
        )
        await queryInterface.createTable(
          'permissions',
          {
            id: {
              primaryKey: true,
              type: Sequelize.UUID,
              allowNull: false,
            },
            name: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          },
          {
            transaction,
          }
        )
        await queryInterface.addColumn(
          'users',
          'roleId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'roles',
              key: 'id',
            },
            allowNull: false,
          },
          {
            transaction,
          }
        )
        await queryInterface.createTable(
          'permission_roles',
          {
            id: {
              primaryKey: true,
              type: Sequelize.UUID,
              allowNull: false,
            },
            permissionId: {
              type: Sequelize.UUID,
              references: {
                model: 'permissions',
                key: 'id',
              },
              onDelete: 'cascade',
              onUpdate: 'cascade',
            },
            roleId: {
              type: Sequelize.UUID,
              references: {
                model: 'roles',
                key: 'id',
              },
              onDelete: 'cascade',
              onUpdate: 'cascade',
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          },
          {
            transaction,
          }
        )
        await queryInterface.createTable(
          'logs',
          {
            id: {
              primaryKey: true,
              type: Sequelize.UUID,
              allowNull: false,
            },
            gqlData: {
              type: Sequelize.JSON,
              allowNull: false,
            },
            requestHeaders: {
              type: Sequelize.JSON,
              allowNull: false,
            },
            userId: {
              type: Sequelize.UUID,
              references: {
                model: 'users',
                key: 'id',
              },
              allowNull: false,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          },
          {
            transaction,
          }
        )
        return true
      })
    } catch (error) {
      console.log('MIGRATION ERROR', error)
      return error
    }
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.dropTable('permission_roles'),
      queryInterface.dropTable('users'),
      queryInterface.dropTable('logs'),
      queryInterface.dropTable('roles'),
      queryInterface.dropTable('permissions'),
    ])
  },
}
