import { ObjectId } from "mongodb";
import { FUNCTION_RESPONSE } from "../../types/api/api";
import { iStage } from "../../types/stages/stages";
import ErrorHandler from "../../utils/errorHandler";
import { createOneStage, findOneStage, findServices } from "./crud";

export const findStageById = async (id: string): Promise<any> => {
  console.log(id);
  const stage = await findOneStage({ _id: new ObjectId(id) });
  return stage;
};

export const createStageHandler = async (stage: iStage): Promise<FUNCTION_RESPONSE> => {
  if (stage.parent) {
    const check = await findStageById(stage.parent);
    if (check === null) throw new ErrorHandler("Parent not found", 400, [{ error: "Invalid Parent Id" }]);
  } else {
    stage.parent = null;
  }
  const createdStage = await createOneStage(stage);
  return { status: 200, body: createdStage };
};

export const searchConsumer = async (searchQuery: string, departmentType: string): Promise<FUNCTION_RESPONSE> => {
  const query: any = { $text: { $search: searchQuery } };
  departmentType && (query.departmentType = departmentType);
  const consumers = await findServices(query);
  return { status: 200, body: consumers };
};
