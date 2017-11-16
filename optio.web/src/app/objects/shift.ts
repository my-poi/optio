import { ShiftDuration } from '../objects/shift-duration';

export class Shift {
  id: number;
  alias: number;
  sign: string;
  isValid: boolean;
  durations: ShiftDuration[];
}
