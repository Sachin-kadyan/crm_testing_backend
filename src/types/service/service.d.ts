import { ObjectId } from "mongodb";

export interface iService {
  name: string;
  serviceId: string;
  department: ObjectId;
  departmentType: ObjectId;
  tag: ObjectId;
  opdCharge: number;
  ipdCharge: number;
  fourSharingRoomCharge: number;
  twinSharingRoomCharge: number;
  singleRoomCharge: number;
  deluxeRoomCharge: number;
  vipRoomCharge: number;
}
