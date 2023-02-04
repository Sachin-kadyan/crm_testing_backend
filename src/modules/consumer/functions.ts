import { ObjectId } from "mongodb";
import { FUNCTION_RESPONSE } from "../../types/api/api";
import { CONSUMER } from "../../types/consumer/consumer";
import ErrorHandler from "../../utils/errorHandler";
import { findOneConsumer, createConsumer, findConsumer } from "./crud";

const checkExistingConsumer = async (uid: string) => {
  const consumer = await findOneConsumer({ uid });
  if (consumer) throw new ErrorHandler("UHID Exists.", 400);
};

export const findConsumerById = async (id: ObjectId): Promise<CONSUMER | null> => {
  return await findOneConsumer({ _id: id });
};

export const registerConsumerHandler = async (consumer: CONSUMER): Promise<FUNCTION_RESPONSE> => {
  await checkExistingConsumer(consumer.uid);
  const registeredConsumer = await createConsumer(consumer);
  return { status: 200, body: registeredConsumer };
};

export const searchConsumer = async (searchQuery: string): Promise<FUNCTION_RESPONSE> => {
  const consumers = await findConsumer({ $text: { $search: searchQuery } });
  return { status: 200, body: consumers };
};
