import { ScheduleDay } from '../objects/schedule-day';

export interface EmployeeSchedule {
  employeeId: number;
  employeeName: string;
  year: number;
  month: number;
  sortOrder: number;
  column29: boolean;
  column30: boolean;
  column31: boolean;
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
}
