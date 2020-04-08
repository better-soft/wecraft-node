import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_ALGORITHM } from '../setup/config'

export const generateHash = passwordToHash =>
  bcrypt.hashSync(passwordToHash, bcrypt.genSaltSync(8), null)

export const isValidPassword = (userPass, enteredPass) =>
  bcrypt.compareSync(enteredPass, userPass)

export const jwtGenerator = (id, email) => {
  const payload = {
    id,
    email,
  }
  const token = jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
  })
  return token
}
