export class ScheduleDayError {
  id: number;
  error: string;

  constructor(id: number, error: string) {
    this.id = id;
    this.error = error;
  }
}
