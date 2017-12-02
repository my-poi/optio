export class Classification {
  employeeId: number;
  companyUnitId: number;
  validFrom: Date;
  validTo: Date;
  createdBy: number;
  created: Date;

  constructor(employeeId: number, companyUnitId: number, validFrom: Date, validTo: Date, createdBy: number, created: Date) {
    this.employeeId = employeeId;
    this.companyUnitId = companyUnitId;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.createdBy = createdBy;
    this.created = created;
  }
}
