import * as mysql from 'mysql2/promise';
import { config } from '../config';

export class SystemDatabase {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: config.connectionLimit,
      host: config.host,
      user: config.user,
      password: config.password,
      database: 'OptioSystem'
    });
  }

  async execute(sql: string, values: any) {
    const [rows, fields] = await this.pool.execute<mysql.RowDataPacket[]>(sql, values);
    return rows;
  }
}
