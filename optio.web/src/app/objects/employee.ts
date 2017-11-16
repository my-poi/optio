import { Classification } from '../objects/classification';
import { Position } from '../objects/position';

export class Employee {
  id: number;
  positionId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone1: string;
  phone2: string;
  email: string;
  photo: string;
  createdBy: number;
  created: Date;
  updatedBy: number;
  updated: Date;
  position: Position;
  classifications: Classification[];
  companyUnitId: number;
  path: string;
  info?: string;
  isSelected: boolean;
}
