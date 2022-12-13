import { ClientSession, ObjectId } from "mongodb";
import { FUNCTION_RESPONSE } from "../../types/api/api";
import { iPrescription, iTicket } from "../../types/ticket/ticket";
import MongoService, { Collections } from "../../utils/mongo";
import { createOnePrescription, createOneTicket, findServices } from "./crud";

export const createTicketHandler = async (ticket: iTicket): Promise<FUNCTION_RESPONSE> => {
  const createdTicket = await createOneTicket(ticket);
  return { status: 200, body: createdTicket };
};

export const getAllTicketHandler = async () => {
  return await MongoService.collection(Collections.TICKET).find({}).toArray();
};

export const getConsumerTicketsWithPrescription = async (consumer: ObjectId) => {
  const tickets = await MongoService.collection(Collections.TICKET).find<iTicket>({ consumer }).toArray();
  const consumerPrescriptions = await MongoService.collection(Collections.PRESCRIPTION)
    .find<iPrescription>({ consumer })
    .toArray();
  const consumerTicketsWithPrescription: any = [];
  consumerPrescriptions.forEach((pres) => {
    const prescriptionTicket = tickets.find((item) => item.prescription.toString() === pres._id?.toString());
    if (prescriptionTicket) {
      consumerTicketsWithPrescription.push({ ...prescriptionTicket, prescription: pres });
    }
  });
  return consumerTicketsWithPrescription;
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
