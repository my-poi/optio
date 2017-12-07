export interface Vacation {
  employeeId: number;
  start: Date;
  finish: Date;
  comment: string;
  isLocked: boolean;
  createdBy: number;
  created: Date;
  updatedBy: number;
  updated: Date;
}
