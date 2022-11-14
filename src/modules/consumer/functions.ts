import { FUNCTION_RESPONSE } from "../../types/api/api";
import { CONSUMER } from "../../types/consumer/consumer";
import ErrorHandler from "../../utils/errorHandler";
import { findOneConsumer, createConsumer, findConsumer } from "./crud";

const checkExistingConsumer = async (email: string) => {
  const consumer = await findOneConsumer({ email });
  if (consumer) throw new ErrorHandler("Consumer Already Exist", 400, [{ error: "Consumer Already Exist" }]);
};

export const registerConsumerHandler = async (consumer: CONSUMER): Promise<FUNCTION_RESPONSE> => {
  await checkExistingConsumer(consumer.email);
  const registeredConsumer = await createConsumer(consumer);
  return { status: 200, body: registeredConsumer };
};

export const searchConsumer = async (searchQuery: string): Promise<FUNCTION_RESPONSE> => {
  const consumers = await findConsumer({ $text: { $search: searchQuery } });
  return { status: 200, body: consumers };
};
