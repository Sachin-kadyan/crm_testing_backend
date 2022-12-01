import { type } from "os";

export interface iTicket {
  consumer: string;
  stage: string;
  subStage: string;
  prescription: string;
  representative: string;
}

export interface iPrescription {
  consumer: string;
  specialty: string;
  doctor: string;
  condition: string;
  symptoms: string;
  followUp: string | number;
  image: string;
  medicines: iMedicine[] | null;
  diagnostics: iDiagnostic[] | null;
  admission: iAdmission[] | null;
}

export interface iMedicine {
  name: string;
}

export interface iDiagnostic {
  name: string;
}

export interface iAdmission {
  service: string;
}
