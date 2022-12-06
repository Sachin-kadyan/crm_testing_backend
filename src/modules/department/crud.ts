import iDepartment, { iDoctor } from "../../types/department/department";
import getDatabase from "../../utils/mongo";

export const DEPARTMENT_DB = "department";
export const DOCTOR_DB = "doctor";

export const createDepartment = async (department: iDepartment): Promise<iDepartment> => {
  const database = await getDatabase();
  await database.collection<iDepartment>(DEPARTMENT_DB).insertOne(department);
  return department;
};

export const findOneDepartment = async (query: Object): Promise<iDepartment | null> => {
  const database = await getDatabase();
  return await database.collection<iDepartment>(DEPARTMENT_DB).findOne(query);
};

export const findDepartment = async (query: Object): Promise<iDepartment[]> => {
  const database = await getDatabase();
  return await database.collection<iDepartment>(DEPARTMENT_DB).find(query).toArray();
};

export const insertOneDoctor = async (doctor: iDoctor): Promise<iDoctor> => {
  const database = await getDatabase();
  await database.collection<iDoctor>(DOCTOR_DB).insertOne(doctor);
  return doctor;
};

export const findDoctor = async (query: Object): Promise<iDoctor[]> => {
  const database = await getDatabase();
  return await database.collection<iDoctor>(DOCTOR_DB).find(query).toArray();
};
