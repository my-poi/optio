export class Schedule {
  companyUnitId: number;
  companyUnitName: string;
  companyUnitPath: string;
  employeeId: number;
  year: number;
  month: number;
  sortOrder: number;
  plannedIsLocked: number;
  workedIsLocked: number;
  comments: string;
  createdBy: number;
  created: Date;
  updatedBy: number;
  updated: Date;

  constructor(
    companyUnitId: number,
    companyUnitName: string,
    companyUnitPath: string,
    employeeId: number,
    year: number,
    month: number,
    sortOrder: number,
    plannedIsLocked: number,
    workedIsLocked: number,
    comments: string,
    createdBy: number,
    created: Date,
    updatedBy: number,
    updated: Date) {
    this.companyUnitId = companyUnitId;
    this.companyUnitName = companyUnitName;
    this.companyUnitPath = companyUnitPath;
    this.employeeId = employeeId;
    this.year = year;
    this.month = month;
    this.sortOrder = sortOrder;
    this.plannedIsLocked = plannedIsLocked;
    this.workedIsLocked = workedIsLocked;
    this.comments = comments;
    this.createdBy = createdBy;
    this.created = created;
    this.updatedBy = updatedBy;
    this.updated = updated;
  }
}
