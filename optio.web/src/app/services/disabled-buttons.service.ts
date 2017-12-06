import { Injectable } from '@angular/core';

@Injectable()
export class DisabledButtonsService {
  companyUnitAdd = false;
  companyUnitEdit = false;
  companyUnitHide = false;
  companyUnitUnhide = false;
  companyUnitMoveUp = false;
  companyUnitMoveDown = false;
  employeeAdd = false;
  employeeEdit = false;
  schedulesAdd = false;
  schedulesEdit = false;
  schedulesLock = false;
  employeeScheduleMoveUp = false;
  employeeScheduleMoveDown = false;
}
