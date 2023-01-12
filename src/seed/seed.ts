import { ObjectId } from "mongodb";
import { createSearchIndex, createUniqueServiceIndex } from "../modules/service/crud";
import generateEstimate from "../modules/ticket/estimate/createEstimate";

export default async function () {
  false && (await createSearchIndex());
  false && (await createUniqueServiceIndex());
  false && (await generateEstimate(new ObjectId("63bfaf8f7b190547681994fa")));
}
