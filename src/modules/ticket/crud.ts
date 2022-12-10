import { WithId } from "mongodb";
import { CONSUMER } from "../../types/consumer/consumer";
import { iPrescription, iTicket } from "../../types/ticket/ticket";
import getDatabase from "../../utils/mongo";

export const TICKET_DB = "ticket";
export const PRESCRIPTION_DB = "prescription";

const createSearchIndex = async () => {
  const database = await getDatabase();
  await database
    .collection(TICKET_DB)
    .createIndex({ serviceId: "text", name: "text", department: "text", departmentType: "text" });
};

// createSearchIndex();

const createUniqueServiceIndex = async () => {
  const database = await getDatabase();
  await database.collection(TICKET_DB).createIndex({ serviceId: 1 }, { unique: true });
};

// createUniqueServiceIndex();

export const createManyServices = async (services: iTicket[]): Promise<any> => {
  const database = await getDatabase();
  await database.collection(TICKET_DB).insertMany(services);
  return services;
};

export const createOneTicket = async (ticket: iTicket): Promise<iTicket> => {
  const database = await getDatabase();
  await database.collection(TICKET_DB).insertOne(ticket);
  return ticket;
};

export const findOneService = async (query: Object): Promise<CONSUMER> => {
  const database = await getDatabase();
  const consumer = await database.collection(TICKET_DB).findOne(query);
  return consumer as CONSUMER;
};

export const findServices = async (query: Object): Promise<CONSUMER[]> => {
  const database = await getDatabase();
  const consumers = await database.collection(TICKET_DB).find(query).toArray();
  return consumers as CONSUMER[];
};

//prescription
export const createOnePrescription = async (prescription: iPrescription): Promise<iPrescription> => {
  const database = await getDatabase();
  await database.collection<iPrescription>(PRESCRIPTION_DB).insertOne(prescription);
  return prescription;
};
