import { REPRESENTATIVE } from "../../types/representative/representative";
import MongoService from "../../utils/mongo";

export const REPRESENTATIVE_DB = "representative";

export const createRepresentative = async (representative: REPRESENTATIVE): Promise<REPRESENTATIVE> => {
  await MongoService.collection(REPRESENTATIVE_DB).insertOne(representative);
  return representative;
};

export const findRepresentative = async (query: Object) => {
  return await MongoService.collection(REPRESENTATIVE_DB).findOne<REPRESENTATIVE>(query);
};
