import { ClientSession, WithId } from "mongodb";
import { CONSUMER } from "../../types/consumer/consumer";
import { iPrescription, iTicket } from "../../types/ticket/ticket";
import MongoService from "../../utils/mongo";
import getDatabase from "../../utils/mongo";

export const TICKET_DB = "ticket";
export const PRESCRIPTION_DB = "prescription";

const createSearchIndex = async () => {
  await MongoService.collection(TICKET_DB).createIndex({
    serviceId: "text",
    name: "text",
    department: "text",
    departmentType: "text",
  });
};

// createSearchIndex();

const createUniqueServiceIndex = async () => {
  await MongoService.collection(TICKET_DB).createIndex({ serviceId: 1 }, { unique: true });
};

// createUniqueServiceIndex();

// service
export const createManyServices = async (services: iTicket[]): Promise<any> => {
  await MongoService.collection(TICKET_DB).insertMany(services);
  return services;
};

export const findOneService = async (query: Object): Promise<CONSUMER> => {
  const consumer = await MongoService.collection(TICKET_DB).findOne(query);
  return consumer as CONSUMER;
};

export const findServices = async (query: Object): Promise<CONSUMER[]> => {
  const consumers = await MongoService.collection(TICKET_DB).find(query).toArray();
  return consumers as CONSUMER[];
};

// ticket
export const createOneTicket = async (ticket: iTicket): Promise<iTicket> => {
  await MongoService.collection(TICKET_DB).insertOne(ticket);
  return ticket;
};

export const findTicket = async (query: object): Promise<iTicket[]> => {
  return await MongoService.collection(TICKET_DB).find<iTicket>(query).toArray();
};

//prescription
export const createOnePrescription = async (prescription: iPrescription, session: ClientSession) => {
  await MongoService.collection(PRESCRIPTION_DB).insertOne(prescription, { session });
  return prescription;
};
