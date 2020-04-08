import mailgun from 'mailgun-js'
import { MAILGUN_API_KEY, MAILGUN_DOMAIN } from '../setup/config'

const mailClient = mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
})

const sendForgotPasswordPasscodeEmail = (to, code) => {
  const data = {
    from: `Api Boilerplate <me@samples.mailgun.org>`,
    to,
    subject: 'Password Reset Code - API BOILERPLATE',
    text: `Your password reset code: ${code}`,
  }
  return mailClient.messages().send(data, (err, body) => {
    if (err) {
      return err
    }
    return body
  })
}

export default sendForgotPasswordPasscodeEmail
