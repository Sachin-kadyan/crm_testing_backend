import { FUNCTION_RESPONSE } from "../../types/api/api";
import iDepartment from "../../types/department/department";
import ErrorHandler from "../../utils/errorHandler";
import { findOneDepartment, createDepartment, findDepartment } from "./crud";

const checkParentExists = async (parent: string) => {
  const department = await findOneDepartment({ _id: parent });
  if (!department) throw new ErrorHandler("Invalid Parent", 400, [{ error: "Parent does'nt Exist" }]);
};

export const createDepartmentHandler = async (department: iDepartment): Promise<FUNCTION_RESPONSE> => {
  if (department.parent) {
    await checkParentExists(department.parent);
  }
  await createDepartment(department);
  return { status: 200, body: department };
};

export const getAllDepartments = async() => {
  const departments = await findDepartment({})
  return {status : 200, body: departments}
}
