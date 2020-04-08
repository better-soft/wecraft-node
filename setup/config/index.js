const fs = require('fs')

const hourConverter = h => h * 60 * 60 * 1000
const NODE_ENV = process.env.NODE_ENV || 'development'
const LOCAL_CONFIG_EXISTS =
  NODE_ENV === 'development' && fs.existsSync('setup/config/local.js')
const RESET_PASSWORD_EXPIRATION_HOURS = hourConverter(1)
const JWT_SECRET = 'JWT_SECRET_SHUSH'
const JWT_ALGORITHM = 'HS256'
const TWILIO_ACCOUNT_SID = ''
const TWILIO_AUTH_TOKEN = ''
const TWILIO_SERVICE_VERIFICATION_ID = ''
const MAILGUN_API_KEY = ''
const MAILGUN_DOMAIN = ''
const SMS_AUTH_ENABLED = true

const BUGSNAG_OPTIONS = {
  apiKey: 'API_KEY_HERE',
  notifyReleaseStages: ['production'],
  releaseStage: NODE_ENV,
  appVersion: 'APP_VERSION_HERE',
}

const config = {
  development: {
    sequelize: {
      username: 'postgres',
      password: '',
      database: 'DB_NAME',
      host: 'localhost',
      dialect: 'postgres',
      seederStorage: 'sequelize',
    },
    JWT_SECRET,
    JWT_ALGORITHM,
    RESET_PASSWORD_EXPIRATION_HOURS,
    BUGSNAG_OPTIONS,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_VERIFICATION_ID,
    MAILGUN_API_KEY,
    MAILGUN_DOMAIN,
    SMS_AUTH_ENABLED,
    admin: {
      email: 'ADMIN_EMAIL',
      password: 'ADMIN_PASSWORD',
      roleId: 'ADMIN_ROLE_ID',
    },
    serverPort: 3000,
  },
  production: {
    sequelize: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      seederStorage: 'sequelize',
      dialectOptions: {
        ssl: true,
      },
      ssl: true,
    },
    JWT_SECRET,
    JWT_ALGORITHM,
    RESET_PASSWORD_EXPIRATION_HOURS,
    BUGSNAG_OPTIONS,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_VERIFICATION_ID,
    MAILGUN_API_KEY,
    MAILGUN_DOMAIN,
    SMS_AUTH_ENABLED,
    serverPort: 8000,
    admin: {
      email: process.env.ADMIN_MAIL,
      password: process.env.ADMIN_PASSWORD,
      roleId: process.env.ADMIN_ROLE_ID,
    },
  },
}

module.exports = LOCAL_CONFIG_EXISTS ? require('./local.js') : config[NODE_ENV]
