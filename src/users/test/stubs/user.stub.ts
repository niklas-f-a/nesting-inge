import * as bcrypt from 'bcrypt';
import { Role } from '../../../auth/enums/role-enum';
export const adminStub = () => {
  return {
    name: 'Goran Pandev',
    email: 'goran@pandev.com',
    role: Role.ADMIN,
    hashPassword: bcrypt.hashSync('password', 10),
  };
};
