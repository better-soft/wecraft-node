import db from '../../db/models'

const isAuthenticated = (resolve, _directiveArgs, _obj, context) => {
  if (!context.user) {
    throw new Error('You must be authenticated')
  }
  return resolve()
}
const hasPermission = async (resolve, _directiveArgs, obj, context) => {
  if (!context.user) {
    throw new Error('You must be authenticated')
  }
  const foundUser = await db.user.findOne({ where: { id: context.user.id } })
  if (!foundUser) {
    throw new Error('No user found')
  }
  const userRole = await foundUser.getRole()
  if (!userRole) {
    throw new Error('User has no role')
  }
  const rolePermissions = await userRole.getPermissions()
  if (rolePermissions.filter(e => e.name === obj.permission).length <= 0) {
    throw new Error("You Don't have a permission to do this")
  }
  return resolve()
}

export default {
  isAuthenticated,
  hasPermission,
}
