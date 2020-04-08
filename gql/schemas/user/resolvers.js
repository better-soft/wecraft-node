import GraphQLUUID from 'graphql-type-uuid'
import twilio from 'twilio'
import {
  isValidPassword,
  jwtGenerator,
  generateHash,
} from '../../../helpers/auth'
import {
  admin,
  RESET_PASSWORD_EXPIRATION_HOURS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_VERIFICATION_ID,
} from '../../../setup/config'
import sendForgotPasswordPasscodeEmail from '../../../helpers/mailer'

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

const db = require('../../../db/models')

const getUser = async (root, { id }) => {
  try {
    return await db.user.findOne({ where: { id } })
  } catch (error) {
    return error
  }
}

const updateUser = async (root, data) => {
  try {
    const foundUser = await db.user.findOne({ where: { id: data.id } })
    if (!foundUser) {
      return new Error('User Not Found')
    }
    return await foundUser.updateAttributes(data)
  } catch (error) {
    return error
  }
}

const getAllUsers = async () => {
  try {
    return await db.user.findAll()
  } catch (error) {
    return error
  }
}

const signin = async (root, { email, password, smsCode }) => {
  try {
    const foundUser = await db.user.findOne({ where: { email } })
    if (!foundUser) {
      return {
        success: false,
        message: 'Incorrect Credentials',
      }
    }
    if (!isValidPassword(foundUser.passwordHash, password)) {
      return {
        success: false,
        message: 'Incorrect Credentials',
      }
    }
    if (!foundUser.smsAuthEnabled) {
      const token = jwtGenerator(foundUser.id, foundUser.email)
      delete foundUser.passwordHash
      return {
        success: true,
        message: 'Succesefully logged in',
        jwt: token,
        user: foundUser,
      }
    }
    if (!smsCode) {
      await twilioClient.verify
        .services(TWILIO_SERVICE_VERIFICATION_ID)
        .verifications.create({
          to: foundUser.phoneNumber,
          channel: 'sms',
        })
      return {
        success: true,
        message: 'Code Sent To Phone Number',
      }
    }
    const verify = await twilioClient.verify
      .services(TWILIO_SERVICE_VERIFICATION_ID)
      .verificationChecks.create({
        to: foundUser.phoneNumber,
        code: smsCode,
      })
    if (verify.status === 'approved') {
      const token = jwtGenerator(foundUser.id, foundUser.email)
      delete foundUser.passwordHash
      return {
        success: true,
        message: 'Succesefully logged in',
        jwt: token,
        user: foundUser,
      }
    }
    return {
      success: false,
      message: 'Sms Code Incorrect',
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

const signup = async (root, { email, password, phoneNumber }) => {
  try {
    const foundUser = await db.user.findOne({ where: { email } })
    if (foundUser) {
      return { success: false, message: 'Account Already Exists' }
    }
    const newUser = await db.user
      .build({
        email,
        passwordHash: generateHash(password),
        roleId: admin.roleId,
        phoneNumber,
      })
      .save()
    const token = jwtGenerator(newUser.id, newUser.email)
    delete newUser.passwordHash
    return {
      success: true,
      message: 'Succesefully Signed Up',
      jwt: token,
      user: newUser,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}
const me = (root, data, context) => {
  return context.user
}

const forgotPassword = async (root, { email }) => {
  try {
    const foundUser = await db.user.findOne({
      where: { email },
    })
    const passcode = Math.floor(1000 + Math.random() * 9000)
    if (!foundUser) {
      return { success: false, message: 'Email Not Found' }
    }
    await foundUser.update({
      resetPasswordToken: passcode,
      resetPasswordExpires: Date.now() + RESET_PASSWORD_EXPIRATION_HOURS,
    })
    await sendForgotPasswordPasscodeEmail(email, passcode)
    return { success: true, message: 'Email Sent' }
  } catch (err) {
    return { success: false, message: 'Internal Server Error' }
  }
}

const resetPasswordPasscodeCheck = async (root, { email, token, user }) => {
  try {
    const foundUser =
      user ||
      (await db.user.findOne({
        where: {
          email,
        },
      }))
    if (!foundUser) {
      return {
        success: false,
        message: 'User not found',
      }
    }
    if (foundUser.resetPasswordToken !== token) {
      return {
        success: false,
        message: 'Verification code incorrect',
      }
    }

    if (foundUser.resetPasswordExpires < Date.now()) {
      return {
        success: false,
        message: 'Verification code has expired',
      }
    }
    return {
      success: true,
      message: 'Verification Code Correct',
    }
  } catch (err) {
    return { success: false, message: 'Internal Server Error' }
  }
}

const resetPassword = async (root, { email, token, password }) => {
  try {
    const foundUser = await db.user.findOne({
      where: {
        email,
      },
    })

    const check = await resetPasswordPasscodeCheck(root, {
      email,
      token,
      foundUser,
    })

    if (check.success) {
      if (isValidPassword(foundUser.passwordHash, password)) {
        return {
          success: false,
          message: 'Do not type your old password',
        }
      }
      await foundUser.update({
        resetPasswordToken: null,
        resetPasswordExpires: null,
        passwordHash: generateHash(password),
      })
      return { success: true, message: 'Password Changed' }
    }
  } catch (error) {
    return { success: false, message: 'Internal Server Error' }
  }
}

exports.resolver = {
  UUID: GraphQLUUID,
  Query: {
    getUser,
    getAllUsers,
    signin,
    me,
    resetPasswordPasscodeCheck,
  },
  Mutation: {
    updateUser,
    signup,
    forgotPassword,
    resetPassword,
  },
}
