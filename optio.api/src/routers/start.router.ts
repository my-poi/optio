import { Router, Request, Response } from 'express';
import { CompanyUnitsMethods } from '../methods/company-units.methods';
import { EmployeesMethods } from '../methods/employees.methods';
import { HolidayTypesMethods } from '../methods/holiday-types.methods';
import { HolidaysMethods } from '../methods/holidays.methods';
import { PeriodDefinitionsMethods } from '../methods/period-definitions.methods';
import { PeriodsMethods } from '../methods/periods.methods';
import { ShiftsMethods } from '../methods/shifts.methods';

export class StartRouter {
  router = Router();

  constructor(
    private companyUnitsMethods: CompanyUnitsMethods,
    private employeesMethods: EmployeesMethods,
    private holidayTypesMethods: HolidayTypesMethods,
    private holidaysMethods: HolidaysMethods,
    private periodDefinitionsMethods: PeriodDefinitionsMethods,
    private periodsMethods: PeriodsMethods,
    private shiftsMethods: ShiftsMethods
  ) {
    this.router.get('/get-start-data', async (request: Request, response: Response) => {
      const results = {
        companyUnits: await this.companyUnitsMethods.getCompanyUnits(),
        employees: await this.employeesMethods.getEmployees(),
        holidayTypes: await this.holidayTypesMethods.getHolidayTypes(),
        holidays: await this.holidaysMethods.getHolidays(),
        periodDefinitions: await this.periodDefinitionsMethods.getPeriodDefinitions(),
        periods: await this.periodsMethods.getPeriods(),
        shifts: await this.shiftsMethods.getShifts()
      };
      response.json(results);
    });
  }
}
