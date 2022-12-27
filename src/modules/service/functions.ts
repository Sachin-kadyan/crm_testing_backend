import { Collection, ObjectId } from "mongodb";
import { FUNCTION_RESPONSE } from "../../types/api/api";
import { iService } from "../../types/service/service";
import ErrorHandler from "../../utils/errorHandler";
import MongoService, { Collections } from "../../utils/mongo";
import { findDeptTag } from "../department/crud";
import { getAllDepartments } from "../department/functions";
import { createManyServices, findServices } from "./crud";

export const departmentValidations = async (services: iService[]) => {
  const { body } = await getAllDepartments();
  const check = services.every(
    (item) =>
      body.some((dept) => dept._id?.toString() === item.department.toString() && dept.parent === null) &&
      body.some(
        (dept) =>
          dept._id?.toString() === item.departmentType.toString() &&
          dept.parent?.toString() === item.department.toString()
      )
  );
  if (!check) throw new ErrorHandler("Invalid department or department type passed", 400);
};

const tagValidation = async (services: iService[]) => {
  const tags = await findDeptTag({});
  const check = services.every(
    (item) => tags.findIndex((tag) => tag._id!.toString() === item.tag.toString()) !== -1
  );
  if (!check) throw new ErrorHandler("Invalid Tag Passed", 400);
};

export const createServiceHandler = async (services: iService[]): Promise<FUNCTION_RESPONSE> => {
  await departmentValidations(services);
  await tagValidation(services);
  const createdServices = await createManyServices(services);
  return { status: 200, body: createdServices };
};

export const searchService = async (
  searchQuery: string,
  departmentType: string
): Promise<FUNCTION_RESPONSE> => {
  const query: any = { $text: { $search: searchQuery } };
  departmentType && (query.departmentType = departmentType);
  const services = await findServices(query);
  return { status: 200, body: services };
};

export const getServiceById = async (id: ObjectId) => {
  return await MongoService.collection(Collections.SERVICE).findOne<iService>({ _id: id });
};
