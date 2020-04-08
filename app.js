import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import bugsnag from '@bugsnag/js'
import bugsnagExpress from '@bugsnag/plugin-express'
import dbLogger from './middlewares/logger'
import authMiddleware from './middlewares/auth'
import config from './setup/config'
import setupGql from './setup/gql'

const app = express()

const bugSnagClient = bugsnag(config.BUGSNAG_OPTIONS)
bugSnagClient.use(bugsnagExpress)
const bugSnagMiddleware = bugSnagClient.getPlugin('express')
app.use(bugSnagMiddleware.requestHandler)

app.use(bodyParser.json())
app.use(cors())
app.use(logger('dev'))
app.use(authMiddleware)
app.use(dbLogger)
setupGql(app, bugSnagClient, cors)
app.use(cookieParser())

app.use('/', (req, res) =>
  res.json({ title: 'Express', message: 'Hello World!' })
)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  bugSnagClient.notify(err, {
    metaData: {
      reqUrl: req.url,
    },
  })
  return res.status(500).json({ error: err })
})

app.use(bugSnagMiddleware.errorHandler)

export default app
