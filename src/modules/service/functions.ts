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

export const searchService = async (searchQuery: string, tag: string): Promise<FUNCTION_RESPONSE> => {
  const query: any = { $text: { $search: searchQuery } };
  tag && (query.tag = new ObjectId(tag));
  const services = await findServices(query);
  return { status: 200, body: services };
};

export const getServiceById = async (id: ObjectId) => {
  return await MongoService.collection(Collections.SERVICE).findOne<iService>({ _id: id });
};

export const getTotalServiceCount = async () => {
  return await MongoService.collection(Collections.SERVICE).countDocuments();
};

export const getServices = async (page: number, pageLength: number) => {
  return await MongoService.collection(Collections.SERVICE)
    .find<iService>({})
    .limit(pageLength > 50 ? 50 : pageLength)
    .skip(page * pageLength)
    .toArray();
};
