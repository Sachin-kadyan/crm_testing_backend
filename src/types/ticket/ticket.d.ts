import { ObjectId } from "mongodb";

export interface iTicket {
  consumer: ObjectId;
  stage: ObjectId;
  prescription: ObjectId;
  creator: ObjectId;
  assigned: ObjectId;
  value?: number;
  highlights?: string[];
}

export interface iPrescription {
  consumer: ObjectId;
  departments: ObjectId[];
  doctor: ObjectId;
  condition: string;
  symptoms: string;
  followUp: string | number;
  image: string;
  medicines: string[] | null;
  diagnostics: string[] | null;
  admission: string | null;
  _id?: ObjectId;
}
