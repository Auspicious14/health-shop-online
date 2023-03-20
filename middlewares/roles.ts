import dotenv from "dotenv";
dotenv.config();

const userRoleNumber = process.env.USER_ROLE_NUMBER;
const adminRoleNumber = process.env.ADMIN_ROLE_NUMBER;
const employeeRoleNumber = process.env.EMPLOYEE_ROLE_NUMBER;

interface IRoles {
  user?: number;
  admin?: number;
  employee?: number;
}

export const roles: IRoles = {
  user: 2312,
  admin: 4672,
  employee: 4562,
};
