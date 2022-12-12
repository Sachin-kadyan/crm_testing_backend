import { WithId } from "mongodb";
import { CONSUMER } from "../../types/consumer/consumer";
import { iService } from "../../types/service/service";
import { iStage } from "../../types/stages/stages";
import MongoService from "../../utils/mongo";
import getDatabase from "../../utils/mongo";

export const STAGE_DB = "stage";

const createSearchIndex = async () => {
  await MongoService.collection(STAGE_DB).createIndex({
    serviceId: "text",
    name: "text",
    department: "text",
    departmentType: "text",
  });
};

// createSearchIndex();

const createUniqueServiceIndex = async () => {
  await MongoService.collection(STAGE_DB).createIndex({ serviceId: 1 }, { unique: true });
};

// createUniqueServiceIndex();

export const createManyServices = async (services: iService[]): Promise<any> => {
  return await MongoService.collection(STAGE_DB).insertMany(services);
};

// services

export const findServices = async (query: Object): Promise<CONSUMER[]> => {
  return await MongoService.collection(STAGE_DB).find<CONSUMER>(query).toArray();
};

// stages
export const createOneStage = async (stage: iStage) => {
  await MongoService.collection(STAGE_DB).insertOne(stage);
  return stage;
};

export const findOneStage = async (query: object) => {
  return await MongoService.collection(STAGE_DB).findOne<iStage>(query);
};

export const findStage = async (query: any) => {
  return await MongoService.collection(STAGE_DB).find<iStage>(query).toArray();
};
