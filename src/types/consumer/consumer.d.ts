import { ObjectId } from "mongodb";

export interface CONSUMER {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  uid: string;
  dob: string | number | Date;
  gender: "M" | "F" | "O";
  address: {
    house: number;
    city: string;
    state: string;
    postalCode: number;
  };
}
