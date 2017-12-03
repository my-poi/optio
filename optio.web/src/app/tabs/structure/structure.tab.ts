import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DisabledButtonsService } from '../../services/disabled-buttons.service';
import { RibbonInfosService } from '../../services/ribbon-infos.service';
import { CompanyUnit } from '../../objects/company-unit';
import { Employee } from '../../objects/employee';
import { EmployeesFilter } from '../../objects/employees-filter';

@Component({
  selector: 'app-structure-tab',
  templateUrl: './structure.tab.html',
  styleUrls: ['./structure.tab.css']
})
export class StructureTab {
  companyUnitsHeight = window.innerHeight - 201;
  employeesTableWidth = window.innerWidth - 552;
  employeesTableBodyHeight = window.innerHeight - 280;
  employeesInfoHeight = window.innerHeight - 203;
  companyUnits = this.dataService.hierarchicalCompanyUnits;
  allEmployees: Employee[];
  foundEmployees: Employee[];
  employeesFilter = new EmployeesFilter();
  companyUnitsOptions = {allowDrop: false};
  selectedCompanyUnit: CompanyUnit;
  selectedEmployee: Employee;

  constructor(private dataService: DataService,
    private disabledButtonsService: DisabledButtonsService,
    private ribbonInfosService: RibbonInfosService) { }

  filterEmployees() {
    const result = this.allEmployees.filter(x => {
      if (x.lastName.toLowerCase().indexOf(this.employeesFilter.lastName.toLocaleLowerCase()) >= 0 &&
        x.firstName.toLowerCase().indexOf(this.employeesFilter.firstName.toLocaleLowerCase()) >= 0 &&
        x.phone1.toLowerCase().indexOf(this.employeesFilter.phone1.toLocaleLowerCase()) >= 0 &&
        x.phone1.toLowerCase().indexOf(this.employeesFilter.phone1.toLocaleLowerCase()) >= 0 &&
        x.email.toLowerCase().indexOf(this.employeesFilter.email.toLocaleLowerCase()) >= 0) return true;
      return false;
    });

    this.foundEmployees = result.slice();
    this.deselectEmployee();
    if (this.foundEmployees.length > 0) this.selectEmployee(this.foundEmployees[0]);
    else this.selectedEmployee = null;
    this.disabledButtonsService.employeeEdit = !this.selectedEmployee;
  }

  onInitialized(tree) {
    tree.treeModel.roots[0].toggleActivated();
    this.selectAllClassifiedEmployees();
  }

  onActivate(event) {
    this.employeesFilter.clear();
    this.selectedCompanyUnit = event.node.data;
    this.deselectEmployee();
    if (this.selectedCompanyUnit.id === 1) this.selectAllClassifiedEmployees();
    else if (this.selectedCompanyUnit.id === 0) this.selectAllEmployees();
    else this.selectCompanyUnitEmployees(this.selectedCompanyUnit);
    if (this.allEmployees.length > 0) this.selectEmployee(this.allEmployees[0]);
    else this.selectedEmployee = null;
    this.setRibbonButtons();
  }

  selectEmployee(employee) {
    if (!this.selectedEmployee) this.selectedEmployee = new Employee();
    this.deselectEmployee();
    this.selectedEmployee = employee;
    this.selectedEmployee.isSelected = true;
  }

  deselectEmployee() {
    if (this.selectedEmployee) this.selectedEmployee.isSelected = false;
  }

  selectAllClassifiedEmployees() {
    this.allEmployees = this.dataService.employees.filter(x => x.companyUnitId);
    this.copyToFoundEmployees();
  }

  selectAllEmployees() {
    this.allEmployees = this.dataService.employees;
    this.copyToFoundEmployees();
  }

  selectCompanyUnitEmployees(companyUnit) {
    const nodeIds = [companyUnit.id];
    this.getAllCompanyUnitChildIds(companyUnit, nodeIds);
    this.allEmployees = this.dataService.employees.filter(x =>
      nodeIds.includes(x.companyUnitId));
    this.copyToFoundEmployees();
  }

  getAllCompanyUnitChildIds(companyUnit, nodeIds) {
    const childIds = companyUnit.children.map(x => x.id);
    childIds.forEach(x => nodeIds.push(x));
    companyUnit.children.forEach(x =>
      this.getAllCompanyUnitChildIds(x, nodeIds));
  }

  copyToFoundEmployees() {
    this.foundEmployees = this.allEmployees.slice();
  }

  setRibbonButtons() {
    const disabled = this.selectedCompanyUnit.id === 0;
    this.disabledButtonsService.companyUnitAdd = disabled;
    this.disabledButtonsService.companyUnitEdit = disabled;
    this.disabledButtonsService.companyUnitHide = disabled;
    this.disabledButtonsService.companyUnitUnhide = disabled;
    this.disabledButtonsService.companyUnitMoveUp = disabled;
    this.disabledButtonsService.companyUnitMoveDown = disabled;
    this.disabledButtonsService.employeeAdd = !this.selectedCompanyUnit.isClassified;
    this.disabledButtonsService.employeeEdit = !this.selectedEmployee;
  }

  droppedEmployee(employeeId: number, nodeId: number) {
    const info = 'id przeciąganego pracownika: ' + employeeId + '\n' + 'id komórki: ' + nodeId;
    this.ribbonInfosService.structureInfo = info;
  }
}

