import { ScheduleDay } from '../objects/schedule-day';

export class EmployeeSchedule {
  employeeId: number;
  employeeName: string;
  year: number;
  month: number;
  sortOrder: number;
  monthlyHours: number;
  monthlyMinutes: number;
  monthlyDays: number;
  monthlyBackground: number;
  totalHours: number;
  totalMinutes: number;
  totalDays: number;
  totalBackground: number;
  createdBy: number;
  created: Date;
  sd: ScheduleDay[];

  constructor(
    employeeId: number,
    employeeName: string,
    year: number,
    month: number,
    sortOrder: number,
    monthlyHours: number,
    monthlyMinutes: number,
    monthlyDays: number,
    monthlyBackground: number,
    totalHours: number,
    totalMinutes: number,
    totalDays: number,
    totalBackground: number,
    createdBy: number,
    created: Date,
    scheduleDays: ScheduleDay[]) {
      this.employeeId = employeeId;
      this.employeeName = employeeName;
      this.year = year;
      this.month = month;
      this.sortOrder = sortOrder;
      this.monthlyHours = monthlyHours;
      this.monthlyMinutes = monthlyMinutes;
      this.monthlyDays = monthlyDays;
      this.monthlyBackground = monthlyBackground;
      this.totalHours = totalHours;
      this.totalMinutes = totalMinutes;
      this.totalDays = totalDays;
      this.totalBackground = totalBackground;
      this.createdBy = createdBy;
      this.created = created;
      this.sd = scheduleDays;
  }
}
