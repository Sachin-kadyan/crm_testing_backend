import { CONSUMER } from "../../types/consumer/consumer";
import getDatabase from "../../utils/mongo";

export const CONSUMER_DB = "consumer";

const createSearchIndex = async () => {
  const database = await getDatabase();
  await database
    .collection(CONSUMER_DB)
    .createIndex({ firstName: "text", lastName: "text", email: "text", phone: "text", uid: "text", dob: "text" });
};

// createSearchIndex();

export const createConsumer = async (consumer: CONSUMER): Promise<CONSUMER> => {
  const database = await getDatabase();
  await database.collection(CONSUMER_DB).insertOne(consumer);
  return consumer;
};

export const findOneConsumer = async (query: Object): Promise<CONSUMER> => {
  const database = await getDatabase();
  const consumer = await database.collection(CONSUMER_DB).findOne(query);
  return consumer as CONSUMER;
};

export const findConsumer = async (query: Object): Promise<CONSUMER[]> => {
  const database = await getDatabase();
  const consumers = await database.collection(CONSUMER_DB).find(query).toArray();
  return consumers as CONSUMER[];
};
