import { ClientSession, ObjectId } from "mongodb";
import { FUNCTION_RESPONSE } from "../../types/api/api";
import { iEstimate, iPrescription, iTicket } from "../../types/ticket/ticket";
import MongoService, { Collections } from "../../utils/mongo";
import { createOnePrescription, createOneTicket, findServices } from "./crud";

export const createTicketHandler = async (ticket: iTicket): Promise<FUNCTION_RESPONSE> => {
  const createdTicket = await createOneTicket(ticket);
  return { status: 200, body: createdTicket };
};

export const getAllTicketHandler = async () => {
  return await MongoService.collection(Collections.TICKET).find({}).toArray();
};

export const getConsumerTickets = async (consumerId: ObjectId) => {
  return await MongoService.collection(Collections.TICKET).find<iTicket>({ consumer: consumerId }).toArray();
};

export const getConsumerPrescriptions = async (consumerId: ObjectId) => {
  return await MongoService.collection(Collections.PRESCRIPTION)
    .find<iPrescription>({ consumer: consumerId })
    .toArray();
};

export const createPrescription = async (prescription: iPrescription, session: ClientSession) => {
  return await createOnePrescription(prescription, session);
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

//prescription

export const getPrescriptionById = async (id: ObjectId) => {
  return await MongoService.collection(Collections.PRESCRIPTION).findOne<iPrescription>({ _id: id });
};

//estimate
export const createEstimate = async (estimate: iEstimate, session: ClientSession) => {
  await MongoService.collection(Collections.ESTIMATE).insertOne(estimate, { session });
  return estimate;
};

export const findEstimateById = async (estimateId: ObjectId) => {
  return await MongoService.collection(Collections.ESTIMATE).findOne<iEstimate>({ _id: estimateId });
};
