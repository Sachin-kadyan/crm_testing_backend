import { ObjectId } from "mongodb";
import { createNodeIndexes } from "../modules/flow/functions";
import {
  createSearchIndex,
  createUniqueServiceIndex,
} from "../modules/service/crud";
import { createConsumerIndex } from "../modules/consumer/crud";
import generateEstimate from "../modules/ticket/estimate/createEstimate";
import firestore from "../services/firebase/firebase";

export default async function () {
  false && (await createSearchIndex());
  false && (await createUniqueServiceIndex());
  false && (await createNodeIndexes());
  false && (await createConsumerIndex());
  // false && (await generateEstimate(new ObjectId("63bfaf8f7b190547681994fa")));
  // firestore.collection("user").doc("akhil").set({ name: "akhil" });
}
