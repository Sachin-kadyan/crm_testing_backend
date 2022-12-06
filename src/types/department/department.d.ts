export default interface iDepartment {
  name: string;
  tags: string[];
  parent: string | null;
  _id?: string;
}

export interface iDoctor {
  name: string;
  departments: string[];
  _id?: string;
}
