import { Classification } from '../objects/classification';

export class Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone1: string;
  phone2: string;
  fax: string;
  email: string;
  photo: string;
  createdBy: number;
  created: Date;
  updatedBy: number;
  updated: Date;
  classifications: Classification[];
  companyUnitId: number;
  path: string;
  info?: string;
  isSelected: boolean;
}
