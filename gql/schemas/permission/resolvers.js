import GraphQLUUID from 'graphql-type-uuid'
import db from '../../../db/models'

const getRoles = async root => {
  if (root.roles) {
    return root.roles
  }
  try {
    return await db.permission.findOne({ where: { id: root.id } }).getRoles()
  } catch (error) {
    return error
  }
}

const getPermission = async (root, data) => {
  try {
    return await db.permission.findOne({
      where: { id: data.id },
      include: [{ model: db.role, as: 'roles' }],
    })
  } catch (error) {
    return error
  }
}

const createPermission = async (root, data) => {
  try {
    return await db.permission.build(data).save()
  } catch (error) {
    return error
  }
}

const addPermissionToRole = async (root, data) => {
  try {
    const foundPermission = await db.permission.findOne({
      where: { id: data.permissionId },
    })
    await foundPermission.addRole(data.roleId)
    return foundPermission
  } catch (error) {
    return error
  }
}

const removePermissionFromRole = async (root, data) => {
  try {
    const foundPermission = await db.permission.findOne({
      where: { id: data.permissionId },
    })
    await foundPermission.removeRole(data.roleId)
    return foundPermission
  } catch (error) {
    return error
  }
}

const deletePermission = async (root, data) => {
  try {
    const deletion = await db.permission.destroy({
      where: { id: data.id },
    })
    return deletion === 1 ? { success: true } : { success: false }
  } catch (error) {
    return error
  }
}

exports.resolver = {
  UUID: GraphQLUUID,
  Permission: {
    roles: getRoles,
  },
  Query: {
    getPermission,
  },
  Mutation: {
    createPermission,
    addPermissionToRole,
    removePermissionFromRole,
    deletePermission,
  },
}
