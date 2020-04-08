import GraphQLUUID from 'graphql-type-uuid'
import GraphQLJSON from 'graphql-type-json'
import db from '../../../db/models'

const getUser = async root => {
  if (root.user) {
    return root.user
  }
  try {
    return await db.user.findOne({ where: { id: root.userId } })
  } catch (error) {
    return error
  }
}

const getLog = async (root, { id }) => {
  try {
    return await db.log.findOne({
      where: { id },
      include: [
        {
          model: db.user,
        },
      ],
    })
  } catch (error) {
    return error
  }
}

// Gets All The user Logs
const getUserLogs = async (root, { userId }) => {
  try {
    return await db.log.findAll({ where: { userId } })
  } catch (error) {
    return error
  }
}

exports.resolver = {
  JSON: GraphQLJSON,
  UUID: GraphQLUUID,
  Log: {
    user: getUser,
  },
  Query: {
    getLog,
    getUserLogs,
  },
}
