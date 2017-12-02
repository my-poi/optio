import { Classification } from './classification';

export class Employee {
  id: number;
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  fax: string;
  email: string;
  photo: string;
  createdBy: number;
  created: Date;
  updatedBy: number;
  updated: Date;
  classifications?: Classification[];

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    phone1: string,
    phone2: string,
    fax: string,
    email: string,
    photo: string,
    createdBy: number,
    created: Date,
    updatedBy: number,
    updated: Date,
    classifications?: Classification[]) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone1 = phone1;
    this.phone2 = phone2;
    this.fax = fax;
    this.email = email;
    this.photo = photo;
    this.createdBy = createdBy;
    this.created = created;
    this.updatedBy = updatedBy;
    this.updated = updated;
    this.classifications = classifications;
  }
}
