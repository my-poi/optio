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
}
