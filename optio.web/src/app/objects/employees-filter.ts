export class EmployeesFilter {
  lastName: string;
  firstName: string;
  phone1: string;
  phone2: string;
  email: string;

  clear() {
    this.lastName = '';
    this.firstName = '';
    this.phone1 = '';
    this.phone2 = '';
    this.email = '';
  }
}
