import { ShiftDuration } from '../objects/shift-duration';

export class Shift {
  id: number;
  sign: string;
  isValid: boolean;
  isSelected?: boolean;
  durations: ShiftDuration[];
  current: ShiftDuration;
}
