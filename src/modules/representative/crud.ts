import { REPRESENTATIVE } from "../../types/representative/representative";
import getDatabase from "../../utils/mongo";

export const REPRESENTATIVE_DB = "representative";

export const createRepresentative = async (representative: REPRESENTATIVE): Promise<REPRESENTATIVE> => {
  const database = await getDatabase();
  await database.collection(REPRESENTATIVE_DB).insertOne(representative);
  return representative;
};

export const findRepresentative = async (query: Object): Promise<REPRESENTATIVE> => {
  const database = await getDatabase();
  const representative = await database.collection(REPRESENTATIVE_DB).findOne(query);
  return representative as REPRESENTATIVE;
};
