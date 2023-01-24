import { ObjectId } from "mongodb";

export interface iService {
  name: string;
  serviceId: string;
  department: ObjectId;
  departmentType: ObjectId;
  tag: ObjectId;
  charges: {
    opd: number;
    ipd: number;
    four: number;
    twin: number;
    single: number;
    deluxe: number;
    vip: number;
  }[];
}
