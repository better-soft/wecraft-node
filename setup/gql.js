import { makeExecutableSchema } from 'graphql-tools'
import glue from 'schemaglue'
import { addDirectiveResolveFunctionsToSchema } from 'graphql-directive'
import expressGraphql from 'express-graphql'
import { graphqlUploadExpress } from 'graphql-upload'
import directiveResolvers from '../gql/directiveResolvers'

const { schema, resolver } = glue('./gql/schemas')
const directedSchema = `directive @isAuthenticated on FIELD | FIELD_DEFINITION \n\n directive @hasPermission(permission: String) on FIELD | FIELD_DEFINITION \n\n${schema}`
const executableSchema = makeExecutableSchema({
  typeDefs: directedSchema,
  resolvers: resolver,
})

addDirectiveResolveFunctionsToSchema(executableSchema, directiveResolvers)

export default (app, bugsnagClient, cors) => {
  const graphqlOptions = req => ({
    schema: executableSchema,
    graphiql: {
      endpoint: '/graphiql',
    },
    context: {
      user: req.user || null, // added user to context to be used in graphql
    },
    formatError: err => {
      bugsnagClient.notify(err, {
        metaData: {
          isGraphqlError: true,
          path: err.path,
          other: JSON.stringify(err),
          stack: err.stack,
          sourceBody: err.source.body,
        },
      })
      return err
    },
  })
  return app.use(
    ['/graphql'],
    cors(),
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), // Needs Changes
    expressGraphql(graphqlOptions)
  )
}
