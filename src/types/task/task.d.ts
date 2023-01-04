import { ObjectId } from "mongodb";

export interface iReminder {
  _id?: ObjectId;
  date: Date;
  title: string;
  description: string;
  creator: ObjectId;
  ticket: ObjectId;
}

export interface iTodo {
  _id?: ObjectId;
  date: Date;
  title: string;
  description: string;
  creator: ObjectId;
  ticket: ObjectId;
  status: boolean;
}
