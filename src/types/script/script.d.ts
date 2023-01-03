import { ObjectId } from "mongodb";

export interface iScript {
  _id?: ObjectId;
  text: string;
  service: ObjectId;
  stage: ObjectId;
}
