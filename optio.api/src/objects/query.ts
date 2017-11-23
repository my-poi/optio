export class Query {
  name: string;
  sql: string;

  constructor(name: string, sql: string) {
    this.name = name;
    this.sql = sql;
  }
}
