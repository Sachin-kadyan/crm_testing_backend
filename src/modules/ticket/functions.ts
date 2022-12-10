import { FUNCTION_RESPONSE } from "../../types/api/api";
import { iPrescription, iTicket } from "../../types/ticket/ticket";
import { createOnePrescription, createOneTicket, findServices } from "./crud";

export const createTicketHandler = async (ticket: iTicket): Promise<FUNCTION_RESPONSE> => {
  const createdTicket = await createOneTicket(ticket);
  return { status: 200, body: createdTicket };
};

export const createPrescription = async (prescription: iPrescription) => {
  return await createOnePrescription(prescription);
};

export const searchConsumer = async (searchQuery: string, departmentType: string): Promise<FUNCTION_RESPONSE> => {
  const query: any = { $text: { $search: searchQuery } };
  departmentType && (query.departmentType = departmentType);
  const consumers = await findServices(query);
  return { status: 200, body: consumers };
};
