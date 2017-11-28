import { ShiftDuration } from '../objects/shift-duration';

export class Shift {
  id: number;
  sign: string;
  isValid: boolean;
  isSelected?: boolean;
  durations?: ShiftDuration[];
  current?: ShiftDuration;

  constructor(id: number, sign: string, isValid: boolean, isSelected?: boolean, durations?: ShiftDuration[], current?: ShiftDuration) {
    this.id = id;
    this.sign = sign;
    this.isValid = isValid;
    this.isSelected = isSelected;
    this.durations = durations;
    this.current = current;
  }
}
