import { WithId } from "mongodb";
import { CONSUMER } from "../../types/consumer/consumer";
import { iService } from "../../types/service/service";
import { iStage } from "../../types/stages/stages";
import getDatabase from "../../utils/mongo";

export const STAGE_DB = "stage";

const createSearchIndex = async () => {
  const database = await getDatabase();
  await database
    .collection(STAGE_DB)
    .createIndex({ serviceId: "text", name: "text", department: "text", departmentType: "text" });
};

// createSearchIndex();

const createUniqueServiceIndex = async () => {
  const database = await getDatabase();
  await database.collection(STAGE_DB).createIndex({ serviceId: 1 }, { unique: true });
};

// createUniqueServiceIndex();

export const createManyServices = async (services: iService[]): Promise<any> => {
  const database = await getDatabase();
  await database.collection(STAGE_DB).insertMany(services);
  return services;
};

export const createOneStage = async (stage: iStage): Promise<iStage> => {
  const database = await getDatabase();
  await database.collection(STAGE_DB).insertOne(stage);
  return stage;
};

export const findOneStage = async (query: Object): Promise<WithId<iStage> | null> => {
  const database = await getDatabase();
  const stage = await database.collection<iStage>(STAGE_DB).findOne(query);
  return stage;
};

export const findServices = async (query: Object): Promise<CONSUMER[]> => {
  const database = await getDatabase();
  const consumers = await database.collection(STAGE_DB).find(query).toArray();
  return consumers as CONSUMER[];
};
