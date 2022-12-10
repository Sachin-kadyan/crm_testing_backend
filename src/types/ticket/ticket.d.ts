export interface iTicket {
  consumer: string;
  stage: string;
  prescription: string;
  representative: string;
}

export interface iPrescription {
  consumer: string;
  departments: string[];
  doctor: string;
  condition: string;
  symptoms: string;
  followUp: string | number;
  image: string;
  medicines: string[] | null;
  diagnostics: string[] | null;
  admission: string | null;
}
