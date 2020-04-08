import GraphQLUUID from 'graphql-type-uuid'
import db from '../../../db/models'

const getUsers = async root => {
  if (root.users) {
    return root.users
  }
  try {
    return await db.user.findAll({ where: { roleId: root.id } })
  } catch (error) {
    return error
  }
}
const getPermissions = async root => {
  if (root.permissions) return root.permissions

  try {
    return await db.role.findOne({ where: { id: root.id } }).getPermissions()
  } catch (error) {
    return error
  }
}

const getRole = async (root, data) => {
  try {
    return await db.role.findOne({
      where: { id: data.id },
      include: [
        {
          model: db.user,
        },
        {
          model: db.permission,
        },
      ],
    })
  } catch (error) {
    return error
  }
}

const createRole = async (root, data) => {
  try {
    return await db.role.build(data).save()
  } catch (error) {
    return error
  }
}

const updateRole = async (root, data) => {
  try {
    const foundRole = await db.role.findOne({ where: { id: data.id } })
    if (!foundRole) {
      return new Error('Role Not Found')
    }
    return await foundRole.updateAttributes(data)
  } catch (error) {
    return error
  }
}

const assignUserRole = async (root, data) => {
  try {
    const foundRole = await db.role.findOne({ where: { id: data.roleId } })
    return await foundRole.addUser(data.userId)
  } catch (error) {
    return error
  }
}

const updateUserRole = async (root, data) => {
  try {
    const foundUser = await db.user.findOne({ where: { id: data.userId } })
    if (!foundUser) {
      return new Error('User Not Found')
    }
    await foundUser.setRole(data.roleId)
    return await db.role.findOne({ where: { id: data.roleId } })
  } catch (error) {
    return error
  }
}

const deleteRole = async (root, data) => {
  try {
    const deletion = await db.role.destroy({
      where: { id: data.id },
    })
    return deletion === 1 ? { success: true } : { success: false }
  } catch (error) {
    return error
  }
}

exports.resolver = {
  UUID: GraphQLUUID,
  Role: {
    users: getUsers,
    permissions: getPermissions,
  },
  Query: {
    getRole,
  },
  Mutation: {
    createRole,
    updateRole,
    assignUserRole,
    updateUserRole,
    deleteRole,
  },
}
