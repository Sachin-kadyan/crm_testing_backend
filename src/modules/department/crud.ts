import { WithId } from "mongodb";
import iDepartment, { iDoctor, iTag } from "../../types/department/department";
import getDatabase from "../../utils/mongo";

export const DEPARTMENT_DB = "department";
export const DOCTOR_DB = "doctor";
export const DEPARTMENT_TAG_DB = "department_tag";

export const createDepartment = async (department: iDepartment): Promise<iDepartment> => {
  const database = await getDatabase();
  await database.collection<iDepartment>(DEPARTMENT_DB).insertOne(department);
  return department;
};

export const findOneDepartment = async (query: object): Promise<iDepartment | null> => {
  const database = await getDatabase();
  return await database.collection<iDepartment>(DEPARTMENT_DB).findOne(query);
};

export const findDepartment = async (query: object): Promise<iDepartment[]> => {
  const database = await getDatabase();
  return await database.collection<iDepartment>(DEPARTMENT_DB).find(query).toArray();
};

// doctor crud
export const insertOneDoctor = async (doctor: iDoctor): Promise<iDoctor> => {
  const database = await getDatabase();
  await database.collection<iDoctor>(DOCTOR_DB).insertOne(doctor);
  return doctor;
};

export const findOneDoctor = async (query: object): Promise<WithId<iDoctor> | null> => {
  const database = await getDatabase();
  return await database.collection<iDoctor>(DOCTOR_DB).findOne(query);
};

export const findDoctor = async (query: object): Promise<iDoctor[]> => {
  const database = await getDatabase();
  return await database.collection<iDoctor>(DOCTOR_DB).find(query).toArray();
};

// tags crud

export const insertOneDeptTag = async (tag: iTag): Promise<iTag> => {
  const database = await getDatabase();
  await database.collection<iTag>(DEPARTMENT_TAG_DB).insertOne(tag);
  return tag;
};

export const findDeptTag = async (query: any): Promise<WithId<iTag>[]> => {
  const database = await getDatabase();
  return await database.collection<iTag>(DEPARTMENT_TAG_DB).find(query).toArray();
};
