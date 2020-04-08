import gql from 'graphql-tag'
import db from '../db/models'

const isGraphqRequest = req => {
  if (req.user != null && req.url.indexOf('graphql') !== -1) {
    return true
  }
  return false
}

export default (req, res, next) => {
  const nodeEnv = process.env.NODE_ENV || 'development'

  if (!isGraphqRequest(req) || nodeEnv === 'development') return next()

  const requestObj = req.body // Get The Whole Request's body
  const { query } = requestObj // Get The Query STRING from the request (GQL puts all mutations or queieries into query string)
  if (!query) {
    return next()
  }
  const obj = gql`
    ${query}
  `

  const headersObj = req.headers
  // Object witch holds GQL query data(formatted, parsed). We have Query name, Operation(M/Q), Arguments and what does the user wants back(Returns)

  const LogObj = obj.definitions.map(def => {
    return def.selectionSet.selections.map(sel => {
      const log = {}
      log[sel.name.value] = {
        operation: def.operation,
        arguments: sel.arguments.map(arg => {
          const argObj = {}
          argObj[arg.name.value] = arg.value.value
          return argObj
        }),
        returns: sel.selectionSet.selections.map(selection => {
          return selection.name.value
        }),
      }
      return log
    })
  })

  // Build the log
  const newLog = db.log.build({
    gqlData: LogObj,
    requestHeaders: headersObj,
  })

  // Save the log and attach it to the user.
  newLog
    .save()
    .then(result => {
      result.setUser(req.user.id)
    })
    .catch(err => console.log(err))
  return next()
}
