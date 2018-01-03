import { Router, Response } from 'express';
import { EmployeesMethods } from '../methods/employees.methods';

export class EmployeesRouter {
  router = Router();

  constructor(private employeesMethods: EmployeesMethods) {
    this.router.get('/get-employees', async (response: Response) => {
      const results = await this.employeesMethods.getEmployees();
      response.json(results);
    });
  }
}
