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

export interface iEstimate {
  _id: ObjectId;
  type: number; // 0 packaged, 1 non packaged
  wardDays: number;
  icuDays: number;
  icuType: ObjectId;
  isEmergency: boolean;
  paymentType: number; // 0 cash, 1 insurance, 2 cghs/echg
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insurancePolicyAmount?: number;
  service: {
    id: ObjectId;
    isSameSite: boolean;
  }[];
  investigation?: ObjectId[];
  procedure?: ObjectId[];
  investigationAmount?: number;
  procedureAmount?: number;
  medicineAmount?: number;
  equipmentAmount?: number;
  bloodAmount?: number;
  additionalAmount?: number;
  creator: ObjectId;
  prescription: ObjectId;
  ticket: ObjectId;
}
