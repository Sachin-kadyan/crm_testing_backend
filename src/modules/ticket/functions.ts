import { FUNCTION_RESPONSE } from "../../types/api/api";
import { iPrescription, iTicket } from "../../types/ticket/ticket";
import MongoService, { TICKET } from "../../utils/mongo";
import { createOnePrescription, createOneTicket, findServices, findTicket } from "./crud";

export const createTicketHandler = async (ticket: iTicket): Promise<FUNCTION_RESPONSE> => {
  const createdTicket = await createOneTicket(ticket);
  return { status: 200, body: createdTicket };
};

export const getAllTicketHandler = async () => {
  return await MongoService.collection(TICKET).find({}).toArray();
};

export const createPrescription = async (prescription: iPrescription) => {
  return await createOnePrescription(prescription);
};

export const searchConsumer = async (
  searchQuery: string,
  departmentType: string
): Promise<FUNCTION_RESPONSE> => {
  const query: any = { $text: { $search: searchQuery } };
  departmentType && (query.departmentType = departmentType);
  const consumers = await findServices(query);
  return { status: 200, body: consumers };
};
