import uuid from 'uuid/v4'
import SeedConfig from '../../setup/config/SeedConfig'
import allPermisions from '../../dictionary/permissions'

module.exports = {
  up: async queryInterface => {
    try {
      if (SeedConfig.SHOULD_SEED_PERMISSIONS_AND_ROLE) {
        await queryInterface.bulkInsert('roles', [
          {
            ...SeedConfig.DEFAULTS.role,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])
        const permissions = await queryInterface.bulkInsert(
          'permissions',
          allPermisions.map(p => ({
            id: uuid(),
            name: p,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          { returning: true }
        )
        await queryInterface.bulkInsert(
          'permission_roles',
          permissions.map(p => ({
            id: uuid(),
            permissionId: p.id,
            roleId: SeedConfig.DEFAULTS.role.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        )
      }
      if (SeedConfig.SHOULD_SEED_USER) {
        return await queryInterface.bulkInsert('users', [
          {
            ...SeedConfig.DEFAULTS.user,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])
      }
      return true
    } catch (error) {
      console.log('SEEDING ERROR', error)
      return error
    }
  },
}
