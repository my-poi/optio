export class CompanyUnit {
  id: number;
  parentId: number;
  sortOrder: number;
  name: string;
  sign: string;
  phone1: string;
  phone2: string;
  fax: string;
  email: string;
  isExpanded: boolean;
  isClassified: boolean;
  isScheduled: boolean;
  isPosition: boolean;
  isHidden: boolean;
  createdBy: number;
  created: Date;
  updatedBy: number;
  updated: Date;
  children: CompanyUnit[];

  constructor(
    id: number,
    parentId: number,
    sortOrder: number,
    name: string,
    sign: string,
    phone1: string,
    phone2: string,
    fax: string,
    email: string,
    isExpanded: boolean,
    isClassified: boolean,
    isScheduled: boolean,
    isPosition: boolean,
    isHidden: boolean,
    createdBy: number,
    created: Date,
    updatedBy: number,
    updated: Date,
    children: CompanyUnit[]) {
    this.id = id;
    this.parentId = parentId;
    this.sortOrder = sortOrder;
    this.name = name;
    this.sign = sign;
    this.phone1 = phone1;
    this.phone2 = phone2;
    this.fax = fax;
    this.email = email;
    this.isExpanded = isExpanded;
    this.isClassified = isClassified;
    this.isScheduled = isScheduled;
    this.isPosition = isPosition;
    this.isHidden = isHidden;
    this.createdBy = createdBy;
    this.created = created;
    this.updatedBy = updatedBy;
    this.updated = updated;
    this.children = children;
  }
}
