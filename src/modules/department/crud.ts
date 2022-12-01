import iDepartment from "../../types/department/department";
import getDatabase from "../../utils/mongo";

export const DEPARTMENT_DB = "department";

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
