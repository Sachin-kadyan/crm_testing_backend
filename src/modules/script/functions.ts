import { ClientSession, Collection, ObjectId } from "mongodb";
import { iScript } from "../../types/script/script";
import MongoService, { Collections } from "../../utils/mongo";

export const createScript = async (script: iScript, session: ClientSession) => {
  await MongoService.collection(Collections.SCRIPT).insertOne(script, { session });
  return script;
};

export const getScript = async (script: ObjectId, service: ObjectId) => {
  return await MongoService.collection(Collections.SCRIPT).findOne<iScript>({ script, service });
};
