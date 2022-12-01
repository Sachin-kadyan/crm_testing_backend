import { FUNCTION_RESPONSE } from "../../types/api/api";
import { iService } from "../../types/service/service";
import { createManyServices, findServices } from "./crud";

export const createServiceHandler = async (services: iService[]): Promise<FUNCTION_RESPONSE> => {
  const createdServices = await createManyServices(services);
  return { status: 200, body: createdServices };
};

export const searchConsumer = async (searchQuery: string, departmentType: string): Promise<FUNCTION_RESPONSE> => {
  const query: any = { $text: { $search: searchQuery } };
  departmentType && (query.departmentType = departmentType);
  const consumers = await findServices(query);
  return { status: 200, body: consumers };
};
