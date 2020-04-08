import jwt from 'jsonwebtoken'
import gqlTag from 'graphql-tag'
import { JWT_SECRET, JWT_ALGORITHM } from '../setup/config'

const REST_EXCEPTIONS = ['/', '/favicon.ico']
const GRAPHQL_EXCEPTIONS = [
  'signin',
  'signup',
  'resetPassword',
  'forgotPassword',
]

const getFirstQueryName = query =>
  query.definitions[0].selectionSet.selections[0].name.value
const isSingleQuery = query =>
  query.definitions.length === 1 &&
  query.definitions[0].selectionSet.selections.length === 1
const shouldDoGraphqlCheck = req =>
  req.body.query && req.originalUrl === '/graphql'
const isAuthNeeded = (req, res) => {
  if (shouldDoGraphqlCheck(req)) {
    try {
      const query = gqlTag`${req.body.query}`
      const queryName = getFirstQueryName(query)
      const isTheOnlyQuery = isSingleQuery(query)
      if (GRAPHQL_EXCEPTIONS.includes(queryName) && isTheOnlyQuery) {
        return false
      }
      return true
    } catch (error) {
      console.log('Invalid Query', error)
      res.status(500).send(error)
    }
  }
  if (REST_EXCEPTIONS.includes(req.originalUrl)) {
    return false
  }
  return true
}

export default (req, res, next) => {
  if (isAuthNeeded(req, res)) {
    const authorization = (req.headers.authorization || '').toString()
    const token = authorization.split('Bearer ')[1]
    if (!token) {
      const error = 'No Token'
      return next(error)
    }

    try {
      return jwt.verify(
        token,
        JWT_SECRET,
        { algorithm: JWT_ALGORITHM },
        (err, data) => {
          req.user = err ? null : data
          return next(err)
        }
      )
    } catch (err) {
      req.user = null
      return next(err)
    }
  } else {
    return next()
  }
}
