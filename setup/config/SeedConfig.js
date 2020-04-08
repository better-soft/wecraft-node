import APIConfig from './index'
import { generateHash } from '../../helpers/auth'

const SHOULD_SEED_USER = true
const SHOULD_SEED_PERMISSIONS_AND_ROLE = true
const DEFAULTS = {
  user: {
    id: 'cb60d332-ee99-4605-9f8b-f3c57611e64e',
    email: APIConfig.admin.email,
    roleId: APIConfig.admin.roleId,
    passwordHash: generateHash(APIConfig.admin.password),
    phoneNumber: 'numberExample',
  },
  role: {
    name: 'admin',
    id: APIConfig.admin.roleId,
  },
}
export default {
  SHOULD_SEED_USER,
  SHOULD_SEED_PERMISSIONS_AND_ROLE,
  DEFAULTS,
}
