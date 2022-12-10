import { query } from "express";
import { ObjectId, WithId } from "mongodb";
import { FUNCTION_RESPONSE } from "../../types/api/api";
import iDepartment, { iDoctor } from "../../types/department/department";
import ErrorHandler from "../../utils/errorHandler";
import {
  findOneDepartment,
  createDepartment,
  findDepartment,
  insertOneDoctor,
  findDoctor,
  findOneDoctor,
  insertOneDeptTag,
  findDeptTag,
} from "./crud";

const checkParentExists = async (parent: string) => {
  const department = await findOneDepartment({ _id: parent });
  if (!department) throw new ErrorHandler("Invalid Parent", 400, [{ error: "Parent does'nt Exist" }]);
};

export const createDepartmentHandler = async (department: iDepartment): Promise<FUNCTION_RESPONSE> => {
  if (department.parent) {
    await checkParentExists(department.parent);
  }
  if (!department.parent) {
    department.parent = null;
  }
  if (!department.tags) {
    department.tags = [];
  }
  await createDepartment(department);
  return { status: 200, body: department };
};

export const getAllDepartments = async (parent?: boolean) => {
  const query = parent ? { parent: null } : {};
  const departments = await findDepartment(query);
  return { status: 200, body: departments };
};

export const getDepartmentById = async (id: ObjectId): Promise<iDepartment | null> => {
  return await findOneDepartment({ _id: id });
};

// doctors

export const doctorDepartmentValidation = async (departments: string[]) => {
  const { body } = await getAllDepartments(); // system departments
  const check = departments.every((item) => body.some((dept) => dept._id?.toString() === item));
  if (!check) throw new ErrorHandler("Invalid department", 400, [{ error: "invalid request" }]);
};

export const createDoctorHandler = async (name: string, departments: string[]) => {
  await doctorDepartmentValidation(departments);
  const doctor = await insertOneDoctor({ name, departments });
  return { status: 200, body: doctor };
};

export const getDoctorsHandler = async (department: string | undefined, subDepartment: string | undefined) => {
  const departments = [];
  if (department) departments.push(department);
  if (subDepartment) departments.push(subDepartment);
  const query = departments.length !== 0 ? { departments: { $in: departments } } : {};
  const doctors = await findDoctor(query);
  return { status: 200, body: doctors };
};

export const findDoctorById = async (id: string): Promise<WithId<iDoctor> | null> => {
  return await findOneDoctor({ _id: id });
};

// tags

export const createDepartmentTagHandler = async (name: string) => {
  return await insertOneDeptTag({ name });
};

export const findAllDepartmentTagsHandler = async () => {
  return await findDeptTag({});
};
