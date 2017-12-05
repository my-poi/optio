import * as mysql from 'mysql2/promise';
import { config } from '../config';

export class WorkTimeDatabase {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: config.host,
      user: 'sa',
      password: 'ahoj',
      database: 'OptioWorkTime'
    });
  }

  async execute(sql: string, values: any) {
    const [rows, fields] = await this.pool.execute<mysql.RowDataPacket[]>(sql, values);
    return rows;
  }
}
